"""
Data Preprocessing Module for ISS Crew Health Analysis
Handles intelligent cleaning, validation, and preparation of physiological data
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.ensemble import IsolationForest
from scipy import stats
import re
import logging
from typing import Dict, List, Tuple, Optional

logger = logging.getLogger(__name__)

class CrewHealthDataProcessor:
    """Advanced class for preprocessing crew health data with intelligent validation"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.robust_scaler = RobustScaler()
        self.knn_imputer = KNNImputer(n_neighbors=5)
        self.simple_imputer = SimpleImputer(strategy='median')
        self.imputer = SimpleImputer(strategy='median')  # Additional imputer for legacy method
        self.processed_features = []
        self.validation_rules = self._initialize_validation_rules()
        self.cleaning_report = {}
        
    def _initialize_validation_rules(self) -> Dict:
        """Initialize physiological validation rules based on medical literature"""
        return {
            # Age constraints (astronauts typically 25-55 years)
            'age': {'min': 20, 'max': 65, 'typical_min': 25, 'typical_max': 55},
            
            # Mission duration constraints (days)
            'mission_duration': {'min': 1, 'max': 500, 'typical_min': 30, 'typical_max': 400},
            
            # Bone density changes (% from baseline, literature shows -1% to -15% typical)
            'bone_density_change': {'min': -25, 'max': 10, 'typical_min': -15, 'typical_max': -0.5},
            
            # Muscle mass changes (% from baseline, literature shows -5% to -25% typical)
            'muscle_mass_change': {'min': -40, 'max': 15, 'typical_min': -25, 'typical_max': -2},
            
            # Cardiovascular changes (% from baseline)
            'cardiovascular_change': {'min': -20, 'max': 10, 'typical_min': -10, 'typical_max': -0.5},
            
            # Exercise hours per week (realistic bounds)
            'exercise_hours': {'min': 0, 'max': 40, 'typical_min': 2, 'typical_max': 15},
            
            # Pre-flight baseline values (normalized scores, typically 80-120)
            'baseline_score': {'min': 50, 'max': 150, 'typical_min': 80, 'typical_max': 120}
        }
    
    def validate_data_integrity(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Perform comprehensive data integrity validation
        
        Args:
            df: Raw dataframe
            
        Returns:
            DataFrame with validation flags
        """
        logger.info("Starting comprehensive data integrity validation...")
        df_validated = df.copy()
        
        # Initialize validation flags
        df_validated['data_quality_score'] = 100.0
        df_validated['validation_flags'] = ''
        df_validated['invalid_values_count'] = 0
        
        # Check for completely empty rows
        empty_rows = df_validated.isnull().all(axis=1)
        df_validated.loc[empty_rows, 'validation_flags'] += 'EMPTY_ROW;'
        df_validated.loc[empty_rows, 'data_quality_score'] -= 50
        
        # Check for duplicate records
        duplicates = df_validated.duplicated(keep=False)
        df_validated.loc[duplicates, 'validation_flags'] += 'DUPLICATE;'
        df_validated.loc[duplicates, 'data_quality_score'] -= 30
        
        # Validate numerical columns against physiological rules
        for col in df_validated.select_dtypes(include=[np.number]).columns:
            if col in ['data_quality_score', 'invalid_values_count']:
                continue
                
            # Find matching rule by keyword
            rule_key = self._find_matching_rule(col)
            if rule_key:
                rule = self.validation_rules[rule_key]
                
                # Check hard limits (impossible values)
                invalid_mask = (df_validated[col] < rule['min']) | (df_validated[col] > rule['max'])
                if invalid_mask.any():
                    invalid_indices = df_validated[invalid_mask].index
                    for idx in invalid_indices:
                        # Update validation flags
                        current_flags = str(df_validated.loc[idx, 'validation_flags']) if pd.notna(df_validated.loc[idx, 'validation_flags']) else ''
                        df_validated.loc[idx, 'validation_flags'] = current_flags + f'INVALID_{col.upper()};'
                        
                        # Update quality score
                        current_score = pd.to_numeric(df_validated.loc[idx, 'data_quality_score'], errors='coerce')
                        if pd.isna(current_score):
                            current_score = 100
                        df_validated.loc[idx, 'data_quality_score'] = current_score - 40
                        
                        # Update invalid count
                        current_count = pd.to_numeric(df_validated.loc[idx, 'invalid_values_count'], errors='coerce')
                        if pd.isna(current_count):
                            current_count = 0
                        df_validated.loc[idx, 'invalid_values_count'] = current_count + 1
                    
                    logger.warning(f"Found {invalid_mask.sum()} invalid values in {col}")
                
                # Check atypical but possible values
                atypical_mask = (
                    (df_validated[col] >= rule['min']) & (df_validated[col] < rule['typical_min'])
                ) | (
                    (df_validated[col] > rule['typical_max']) & (df_validated[col] <= rule['max'])
                )
                if atypical_mask.any():
                    atypical_indices = df_validated[atypical_mask].index
                    for idx in atypical_indices:
                        # Update validation flags
                        current_flags = str(df_validated.loc[idx, 'validation_flags']) if pd.notna(df_validated.loc[idx, 'validation_flags']) else ''
                        df_validated.loc[idx, 'validation_flags'] = current_flags + f'ATYPICAL_{col.upper()};'
                        
                        # Update quality score
                        current_score = pd.to_numeric(df_validated.loc[idx, 'data_quality_score'], errors='coerce')
                        if pd.isna(current_score):
                            current_score = 100
                        df_validated.loc[idx, 'data_quality_score'] = current_score - 10
                    
                    logger.info(f"Found {atypical_mask.sum()} atypical values in {col}")
        
        # Check for inconsistent patterns
        df_validated = self._check_logical_consistency(df_validated)
        
        # Log validation summary
        high_quality = (df_validated['data_quality_score'] >= 80).sum()
        medium_quality = ((df_validated['data_quality_score'] >= 50) & 
                         (df_validated['data_quality_score'] < 80)).sum()
        low_quality = (df_validated['data_quality_score'] < 50).sum()
        
        logger.info(f"Data quality assessment: High={high_quality}, Medium={medium_quality}, Low={low_quality}")
        
        return df_validated
    
    def _find_matching_rule(self, column_name: str) -> Optional[str]:
        """Find matching validation rule for a column name"""
        column_lower = column_name.lower()
        
        # Direct matches
        for rule_key in self.validation_rules.keys():
            if rule_key in column_lower:
                return rule_key
        
        # Pattern matching
        if any(word in column_lower for word in ['age', 'years']):
            return 'age'
        elif any(word in column_lower for word in ['duration', 'days', 'length']):
            return 'mission_duration'
        elif any(word in column_lower for word in ['bone', 'density', 'bmd']):
            return 'bone_density_change'
        elif any(word in column_lower for word in ['muscle', 'mass', 'strength']):
            return 'muscle_mass_change'
        elif any(word in column_lower for word in ['cardio', 'heart', 'cv']):
            return 'cardiovascular_change'
        elif any(word in column_lower for word in ['exercise', 'workout', 'training']):
            return 'exercise_hours'
        elif any(word in column_lower for word in ['baseline', 'pre_flight', 'initial']):
            return 'baseline_score'
        
        return None
    
    def _check_logical_consistency(self, df: pd.DataFrame) -> pd.DataFrame:
        """Check for logical inconsistencies in the data"""
        
        # Check if mission duration makes sense with changes
        if 'mission_duration_days' in df.columns:
            # Very short missions shouldn't have extreme changes
            short_missions = df['mission_duration_days'] < 30
            for change_col in [col for col in df.columns if 'change' in col.lower()]:
                if change_col in df.columns:
                    extreme_changes = np.abs(df[change_col]) > 10  # >10% change
                    inconsistent = short_missions & extreme_changes
                    if inconsistent.any():
                        df.loc[inconsistent, 'validation_flags'] += f'INCONSISTENT_DURATION_{change_col.upper()};'
                        df.loc[inconsistent, 'data_quality_score'] -= 15
        
        # Check if age is consistent with typical astronaut profiles
        if 'crew_age' in df.columns or 'age' in df.columns:
            age_col = 'crew_age' if 'crew_age' in df.columns else 'age'
            very_young = df[age_col] < 25
            very_old = df[age_col] > 55
            
            if very_young.any():
                df.loc[very_young, 'validation_flags'] += 'YOUNG_ASTRONAUT;'
                df.loc[very_young, 'data_quality_score'] -= 5
            if very_old.any():
                df.loc[very_old, 'validation_flags'] += 'OLD_ASTRONAUT;'
                df.loc[very_old, 'data_quality_score'] -= 5
        
        return df
    
    def clean_data_intelligent(self, df: pd.DataFrame, 
                              quality_threshold: float = 50.0) -> pd.DataFrame:
        """
        Perform intelligent data cleaning based on validation results
        
        Args:
            df: Validated dataframe
            quality_threshold: Minimum quality score to keep records
            
        Returns:
            Cleaned dataframe
        """
        logger.info("Starting intelligent data cleaning...")
        df_clean = df.copy()
        
        # Remove completely invalid records
        if 'data_quality_score' in df_clean.columns:
            invalid_records = df_clean['data_quality_score'] < quality_threshold
            df_clean = df_clean[~invalid_records]
            logger.info(f"Removed {invalid_records.sum()} records with quality score < {quality_threshold}")
        
        # Remove exact duplicates (keep first occurrence)
        initial_len = len(df_clean)
        df_clean = df_clean.drop_duplicates()
        duplicates_removed = initial_len - len(df_clean)
        logger.info(f"Removed {duplicates_removed} duplicate records")
        
        # Clean invalid values in numerical columns
        for col in df_clean.select_dtypes(include=[np.number]).columns:
            if col in ['data_quality_score', 'invalid_values_count']:
                continue
                
            rule_key = self._find_matching_rule(col)
            if rule_key:
                rule = self.validation_rules[rule_key]
                
                # Replace impossible values with NaN
                invalid_mask = (df_clean[col] < rule['min']) | (df_clean[col] > rule['max'])
                if invalid_mask.any():
                    df_clean.loc[invalid_mask, col] = np.nan
                    logger.info(f"Replaced {invalid_mask.sum()} invalid values in {col} with NaN")
        
        # Clean categorical columns
        categorical_cols = df_clean.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if col in ['validation_flags']:
                continue
                
            # Remove obviously invalid entries
            df_clean[col] = df_clean[col].astype(str)
            
            # Clean common invalid patterns
            invalid_patterns = ['nan', 'null', 'none', '', 'n/a', 'unknown', '?', '-', 'missing']
            for pattern in invalid_patterns:
                mask = df_clean[col].str.lower().str.strip() == pattern
                df_clean.loc[mask, col] = np.nan
            
            # Clean whitespace and normalize
            df_clean[col] = df_clean[col].str.strip()
            df_clean[col] = df_clean[col].replace('', np.nan)
        
        # Remove rows that are mostly empty after cleaning
        non_meta_cols = [col for col in df_clean.columns 
                        if not col.startswith(('data_quality', 'validation', 'invalid'))]
        mostly_empty = df_clean[non_meta_cols].isnull().sum(axis=1) > (len(non_meta_cols) * 0.7)
        df_clean = df_clean[~mostly_empty]
        logger.info(f"Removed {mostly_empty.sum()} mostly empty records")
        
        return df_clean
    
    def handle_missing_values_advanced(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Advanced missing value imputation using multiple strategies
        
        Args:
            df: DataFrame with missing values
            
        Returns:
            DataFrame with intelligently imputed values
        """
        logger.info("Starting advanced missing value imputation...")
        df_imputed = df.copy()
        
        # Separate numerical and categorical columns
        numerical_cols = df_imputed.select_dtypes(include=[np.number]).columns
        numerical_cols = [col for col in numerical_cols 
                         if not col.startswith(('data_quality', 'validation', 'invalid'))]
        categorical_cols = df_imputed.select_dtypes(include=['object']).columns
        categorical_cols = [col for col in categorical_cols 
                           if not col.startswith(('validation_flags',))]
        
        # Handle numerical columns
        if len(numerical_cols) > 0:
            # Analyze missing patterns
            missing_counts = df_imputed[numerical_cols].isnull().sum()
            high_missing = missing_counts[missing_counts > len(df_imputed) * 0.5]
            
            if len(high_missing) > 0:
                logger.warning(f"Columns with >50% missing: {list(high_missing.index)}")
            
            # Use different strategies based on missing percentage
            for col in numerical_cols:
                missing_pct = df_imputed[col].isnull().sum() / len(df_imputed)
                
                if missing_pct == 0:
                    continue
                elif missing_pct < 0.1:  # <10% missing: use KNN
                    try:
                        col_data = df_imputed[[col] + [c for c in numerical_cols if c != col]]
                        imputed_values = self.knn_imputer.fit_transform(col_data)[:, 0]
                        df_imputed[col] = imputed_values
                        logger.info(f"KNN imputation for {col} ({missing_pct:.1%} missing)")
                    except:
                        # Fallback to median
                        median_val = df_imputed[col].median()
                        df_imputed[col] = df_imputed[col].fillna(median_val)
                        logger.info(f"Median imputation for {col} (KNN failed)")
                        
                elif missing_pct < 0.3:  # 10-30% missing: use median with grouping if possible
                    # Try to group by categorical variables for better imputation
                    if len(categorical_cols) > 0:
                        for cat_col in categorical_cols:
                            if df_imputed[cat_col].isnull().sum() < len(df_imputed) * 0.5:
                                df_imputed[col] = df_imputed.groupby(cat_col)[col].transform(
                                    lambda x: x.fillna(x.median())
                                )
                                break
                    else:
                        df_imputed[col] = df_imputed[col].fillna(df_imputed[col].median())
                    logger.info(f"Grouped median imputation for {col} ({missing_pct:.1%} missing)")
                    
                else:  # >30% missing: use forward/backward fill or drop
                    if missing_pct > 0.7:
                        logger.warning(f"Dropping {col} due to {missing_pct:.1%} missing data")
                        df_imputed = df_imputed.drop(columns=[col])
                    else:
                        # Forward fill then backward fill (using newer pandas syntax)
                        df_imputed[col] = df_imputed[col].ffill().bfill()
                        remaining_na = df_imputed[col].isnull().sum()
                        if remaining_na > 0:
                            df_imputed[col] = df_imputed[col].fillna(df_imputed[col].median())
                        logger.info(f"Forward/backward fill for {col}")
        
        # Handle categorical columns
        for col in categorical_cols:
            missing_pct = df_imputed[col].isnull().sum() / len(df_imputed)
            
            if missing_pct == 0:
                continue
            elif missing_pct < 0.3:
                # Use mode (most frequent value)
                mode_val = df_imputed[col].mode()
                if len(mode_val) > 0:
                    df_imputed[col] = df_imputed[col].fillna(mode_val.iloc[0])
                else:
                    df_imputed[col] = df_imputed[col].fillna('Unknown')
                logger.info(f"Mode imputation for {col}")
            else:
                df_imputed[col] = df_imputed[col].fillna('Missing')
                logger.info(f"Default 'Missing' imputation for {col}")
        
        return df_imputed
    
    def extract_physiological_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract and engineer physiological features
        
        Args:
            df: Cleaned dataframe
            
        Returns:
            DataFrame with engineered features
        """
        features_df = df.copy()
        
        # Extract mission duration if available
        if 'mission_duration' in features_df.columns:
            features_df['mission_duration_days'] = pd.to_numeric(
                features_df['mission_duration'], errors='coerce'
            )
        
        # Extract age information
        if 'crew_age' in features_df.columns:
            features_df['crew_age_numeric'] = pd.to_numeric(
                features_df['crew_age'], errors='coerce'
            )
        
        # Create feature for bone density metrics
        bone_keywords = ['bone', 'density', 'mineral', 'calcium']
        features_df['bone_related'] = features_df.apply(
            lambda row: any(keyword in str(row).lower() for keyword in bone_keywords),
            axis=1
        )
        
        # Create feature for muscle metrics
        muscle_keywords = ['muscle', 'atrophy', 'strength', 'mass']
        features_df['muscle_related'] = features_df.apply(
            lambda row: any(keyword in str(row).lower() for keyword in muscle_keywords),
            axis=1
        )
        
        # Create feature for cardiovascular metrics
        cardio_keywords = ['cardiovascular', 'heart', 'blood', 'pressure']
        features_df['cardio_related'] = features_df.apply(
            lambda row: any(keyword in str(row).lower() for keyword in cardio_keywords),
            axis=1
        )
        
        return features_df
    
    def handle_missing_values(self, df: pd.DataFrame, 
                            strategy: str = 'median') -> pd.DataFrame:
        """
        Handle missing values in numerical columns
        
        Args:
            df: DataFrame with missing values
            strategy: Imputation strategy ('median', 'mean', 'constant')
            
        Returns:
            DataFrame with imputed values
        """
        df_imputed = df.copy()
        
        # Get numerical columns
        numerical_cols = df_imputed.select_dtypes(include=[np.number]).columns
        
        if len(numerical_cols) > 0:
            # Create new imputer with the desired strategy
            imputer = SimpleImputer(strategy=strategy)
            df_imputed[numerical_cols] = imputer.fit_transform(
                df_imputed[numerical_cols]
            )
            
            logger.info(f"Imputed missing values in {len(numerical_cols)} numerical columns")
        
        return df_imputed
    
    def normalize_features(self, df: pd.DataFrame, 
                          method: str = 'standard') -> pd.DataFrame:
        """
        Normalize numerical features
        
        Args:
            df: DataFrame to normalize
            method: Normalization method ('standard', 'minmax')
            
        Returns:
            DataFrame with normalized features
        """
        df_normalized = df.copy()
        
        # Get numerical columns (excluding ID columns)
        numerical_cols = df_normalized.select_dtypes(include=[np.number]).columns
        id_cols = [col for col in numerical_cols if 'id' in col.lower()]
        feature_cols = [col for col in numerical_cols if col not in id_cols]
        
        if len(feature_cols) > 0:
            if method == 'standard':
                scaler = StandardScaler()
            elif method == 'minmax':
                scaler = MinMaxScaler()
            else:
                raise ValueError("Method must be 'standard' or 'minmax'")
            
            df_normalized[feature_cols] = scaler.fit_transform(
                df_normalized[feature_cols]
            )
            
            self.processed_features = feature_cols
            logger.info(f"Normalized {len(feature_cols)} features using {method} scaling")
        
        return df_normalized
    
    def detect_outliers(self, df: pd.DataFrame, 
                       method: str = 'iqr') -> pd.DataFrame:
        """
        Detect outliers in the data
        
        Args:
            df: DataFrame to check for outliers
            method: Detection method ('iqr', 'zscore')
            
        Returns:
            DataFrame with outlier information
        """
        df_outliers = df.copy()
        numerical_cols = df_outliers.select_dtypes(include=[np.number]).columns
        
        outlier_mask = pd.DataFrame(False, index=df_outliers.index, 
                                  columns=numerical_cols)
        
        for col in numerical_cols:
            if method == 'iqr':
                Q1 = df_outliers[col].quantile(0.25)
                Q3 = df_outliers[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                outlier_mask[col] = (df_outliers[col] < lower_bound) | \
                                   (df_outliers[col] > upper_bound)
            
            elif method == 'zscore':
                z_scores = np.abs((df_outliers[col] - df_outliers[col].mean()) / 
                                df_outliers[col].std())
                outlier_mask[col] = z_scores > 3
        
        # Add outlier information to dataframe
        df_outliers['outlier_count'] = outlier_mask.sum(axis=1)
        df_outliers['is_outlier'] = df_outliers['outlier_count'] > 0
        
        logger.info(f"Detected {df_outliers['is_outlier'].sum()} outlier records")
        
        return df_outliers
    
    def detect_outliers_advanced(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Advanced outlier detection using multiple methods
        
        Args:
            df: DataFrame to analyze
            
        Returns:
            DataFrame with outlier analysis
        """
        df_analyzed = df.copy()
        numerical_cols = [col for col in df_analyzed.select_dtypes(include=[np.number]).columns 
                         if not col.startswith(('data_quality', 'validation', 'invalid', 'outlier'))]
        
        # Outlier detection using multiple methods
        outliers_iqr = set()
        outliers_zscore = set()
        outliers_isolation = set()
        
        for col in numerical_cols:
            if col in df_analyzed.columns:
                # IQR method
                Q1 = df_analyzed[col].quantile(0.25)
                Q3 = df_analyzed[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                col_outliers_iqr = df_analyzed[(df_analyzed[col] < lower_bound) | (df_analyzed[col] > upper_bound)].index
                outliers_iqr.update(col_outliers_iqr)
                
                # Z-score method (using absolute threshold of 3)
                z_scores = np.abs((df_analyzed[col] - df_analyzed[col].mean()) / df_analyzed[col].std())
                col_outliers_zscore = df_analyzed[z_scores > 3].index
                outliers_zscore.update(col_outliers_zscore)
        
        # Isolation Forest (global outlier detection)
        if len(numerical_cols) >= 2:
            try:
                iso_forest = IsolationForest(contamination=0.1, random_state=42)
                outlier_predictions = iso_forest.fit_predict(df_analyzed[numerical_cols].fillna(df_analyzed[numerical_cols].median()))
                outliers_isolation.update(df_analyzed.index[outlier_predictions == -1])
            except:
                logger.warning("Isolation Forest failed, skipping global outlier detection")
        
        # Combine outlier information
        df_analyzed['outliers_iqr'] = df_analyzed.index.isin(outliers_iqr)
        df_analyzed['outliers_zscore'] = df_analyzed.index.isin(outliers_zscore)
        df_analyzed['outliers_isolation'] = df_analyzed.index.isin(outliers_isolation)
        df_analyzed['outlier_consensus'] = (
            df_analyzed['outliers_iqr'].astype(int) + 
            df_analyzed['outliers_zscore'].astype(int) + 
            df_analyzed['outliers_isolation'].astype(int)
        )
        
        logger.info(f"Advanced outlier detection: IQR={len(outliers_iqr)}, Z-score={len(outliers_zscore)}, Isolation={len(outliers_isolation)}")
        
        return df_analyzed
    
    def normalize_features_robust(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Robust feature normalization that handles outliers well
        
        Args:
            df: DataFrame to normalize
            
        Returns:
            DataFrame with robustly normalized features
        """
        df_normalized = df.copy()
        
        # Get numerical columns (excluding metadata and outlier columns)
        numerical_cols = df_normalized.select_dtypes(include=[np.number]).columns
        excluded_patterns = ['data_quality', 'validation', 'invalid', 'outlier', '_id', 'count']
        feature_cols = [col for col in numerical_cols 
                       if not any(pattern in col.lower() for pattern in excluded_patterns)]
        
        if len(feature_cols) > 0:
            # Use RobustScaler which is less sensitive to outliers
            df_normalized[feature_cols] = self.robust_scaler.fit_transform(
                df_normalized[feature_cols].fillna(df_normalized[feature_cols].median())
            )
            
            self.processed_features = feature_cols
            logger.info(f"Robust normalization applied to {len(feature_cols)} features")
        
        return df_normalized
        
        return df_outliers
    
    def preprocess_pipeline(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Complete preprocessing pipeline
        
        Args:
            df: Raw dataframe
            
        Returns:
            Fully preprocessed dataframe
        """
        logger.info("Starting complete preprocessing pipeline...")
        
        # Step 1: Clean data
        df_processed = self.clean_data_intelligent(df)
        
        # Step 2: Extract features
        df_processed = self.extract_physiological_features(df_processed)
        
        # Step 3: Handle missing values
        df_processed = self.handle_missing_values_advanced(df_processed)
        
        # Step 4: Detect outliers (before normalization)
        df_processed = self.detect_outliers_advanced(df_processed)
        
        # Step 5: Normalize features
        df_processed = self.normalize_features_robust(df_processed)
        
        logger.info("Preprocessing pipeline completed successfully")
        
        return df_processed

if __name__ == "__main__":
    # Example usage
    processor = CrewHealthDataProcessor()
    # This would typically load real data
    sample_data = pd.DataFrame({
        'mission_duration': [180, 365, 90, None, 270],
        'crew_age': [35, 42, 28, 38, 45],
        'bone_density_change': [-5.2, -8.1, -2.3, -6.7, -9.2],
        'muscle_mass_change': [-12.1, -18.3, -7.2, -14.5, -20.1]
    })
    
    processed_data = processor.preprocess_pipeline(sample_data)
    print(processed_data.head())
