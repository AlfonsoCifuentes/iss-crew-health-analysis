"""
Advanced ML Model Training with Expanded Dataset
Multi-model ensemble with robust validation for space medicine predictions
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.pipeline import Pipeline
import joblib
import json
import logging
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedSpaceMedicinePredictor:
    """Advanced ML predictor with ensemble methods and robust validation"""
    
    def __init__(self):
        self.models = {}
        self.ensemble_model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        self.performance_metrics = {}
        
    def load_and_prepare_data(self, data_path: str):
        """Load and prepare expanded dataset"""
        logger.info("Loading expanded dataset...")
        df = pd.read_csv(data_path)
        
        # Select features for ML training
        feature_cols = [
            'mission_duration_days', 'crew_age_numeric', 'pre_flight_bone_density', 
            'exercise_hours_per_week', 'mission_type', 'crew_role'
        ]
        target_col = 'bone_density_change'
        
        # Create feature matrix
        X = df[feature_cols].copy()
        y = df[target_col].copy()
        
        # Advanced feature engineering
        X = self.advanced_feature_engineering(X)
        
        logger.info(f"Dataset prepared: {X.shape[0]} samples, {X.shape[1]} features")
        logger.info(f"Data sources: {df['data_source'].value_counts().to_dict()}")
        
        return X, y, df['data_source']
    
    def advanced_feature_engineering(self, X: pd.DataFrame) -> pd.DataFrame:
        """Advanced feature engineering with interaction terms and derived features"""
        
        X_enhanced = X.copy()
        
        # One-hot encode categorical variables
        mission_dummies = pd.get_dummies(X['mission_type'], prefix='mission')
        role_dummies = pd.get_dummies(X['crew_role'], prefix='role')
        
        X_enhanced = pd.concat([X_enhanced, mission_dummies, role_dummies], axis=1)
        X_enhanced.drop(['mission_type', 'crew_role'], axis=1, inplace=True)
        
        # Create interaction features (scientifically meaningful)
        X_enhanced['duration_age_interaction'] = (
            X_enhanced['mission_duration_days'] * X_enhanced['crew_age_numeric']
        )
        X_enhanced['exercise_duration_ratio'] = (
            X_enhanced['exercise_hours_per_week'] / (X_enhanced['mission_duration_days'] / 7)
        )
        X_enhanced['bone_density_age_interaction'] = (
            X_enhanced['pre_flight_bone_density'] * X_enhanced['crew_age_numeric']
        )
        
        # Risk categories based on scientific knowledge
        X_enhanced['high_risk_duration'] = (X_enhanced['mission_duration_days'] > 180).astype(int)
        X_enhanced['low_exercise'] = (X_enhanced['exercise_hours_per_week'] < 10).astype(int)
        X_enhanced['older_crew'] = (X_enhanced['crew_age_numeric'] > 0.5).astype(int)
        
        # Exercise intensity proxy
        X_enhanced['exercise_intensity'] = X_enhanced['exercise_hours_per_week'] / X_enhanced['mission_duration_days'] * 7
        
        self.feature_names = list(X_enhanced.columns)
        logger.info(f"Enhanced features: {len(self.feature_names)} total")
        
        return X_enhanced
    
    def create_ensemble_models(self):
        """Create ensemble of different ML algorithms"""
        
        # Individual models with optimized hyperparameters
        self.models = {
            'random_forest': RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=150,
                learning_rate=0.1,
                max_depth=8,
                random_state=42
            ),
            'ridge_regression': Ridge(
                alpha=1.0,
                random_state=42
            )
        }
        
        # Create ensemble model
        self.ensemble_model = VotingRegressor([
            ('rf', self.models['random_forest']),
            ('gb', self.models['gradient_boosting']),
            ('ridge', self.models['ridge_regression'])
        ])
        
        logger.info("Ensemble model created with 3 base estimators")
    
    def train_and_validate(self, X: pd.DataFrame, y: pd.Series, data_sources: pd.Series):
        """Train models with robust validation including stratified splits"""
        
        # Create stratified split based on data source
        X_train, X_test, y_train, y_test, sources_train, sources_test = train_test_split(
            X, y, data_sources, test_size=0.2, random_state=42, stratify=data_sources
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        logger.info("Training individual models...")
        
        # Train and evaluate individual models
        individual_results = {}
        
        for name, model in self.models.items():
            logger.info(f"Training {name}...")
            
            if name == 'ridge_regression':
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
                cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
            
            # Calculate metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            individual_results[name] = {
                'mse': float(mse),
                'rmse': float(rmse),
                'mae': float(mae),
                'r2': float(r2),
                'cv_mean': float(cv_scores.mean()),
                'cv_std': float(cv_scores.std())
            }
            
            logger.info(f"{name} - R²: {r2:.4f}, RMSE: {rmse:.4f}, CV: {cv_scores.mean():.4f}±{cv_scores.std():.4f}")
        
        # Train ensemble model
        logger.info("Training ensemble model...")
        
        # Prepare data for ensemble (mix of scaled and unscaled)
        ensemble_X_train = X_train.copy()
        ensemble_X_test = X_test.copy()
        
        self.ensemble_model.fit(ensemble_X_train, y_train)
        ensemble_pred = self.ensemble_model.predict(ensemble_X_test)
        
        # Ensemble metrics
        ensemble_mse = mean_squared_error(y_test, ensemble_pred)
        ensemble_rmse = np.sqrt(ensemble_mse)
        ensemble_mae = mean_absolute_error(y_test, ensemble_pred)
        ensemble_r2 = r2_score(y_test, ensemble_pred)
        
        # Cross-validation for ensemble
        ensemble_cv_scores = cross_val_score(self.ensemble_model, X_train, y_train, cv=5, scoring='r2')
        
        ensemble_results = {
            'mse': float(ensemble_mse),
            'rmse': float(ensemble_rmse),
            'mae': float(ensemble_mae),
            'r2': float(ensemble_r2),
            'cv_mean': float(ensemble_cv_scores.mean()),
            'cv_std': float(ensemble_cv_scores.std())
        }
        
        logger.info(f"ENSEMBLE - R²: {ensemble_r2:.4f}, RMSE: {ensemble_rmse:.4f}, CV: {ensemble_cv_scores.mean():.4f}±{ensemble_cv_scores.std():.4f}")
        
        # Store all results
        self.performance_metrics = {
            'individual_models': individual_results,
            'ensemble': ensemble_results,
            'training_info': {
                'total_samples': len(X),
                'training_samples': len(X_train),
                'test_samples': len(X_test),
                'features': len(self.feature_names),
                'data_source_distribution': sources_train.value_counts().to_dict()
            }
        }
        
        return self.performance_metrics
    
    def save_advanced_model(self, model_dir: str = "models"):
        """Save the trained ensemble model and all components"""
        
        model_dir = Path(model_dir)
        model_dir.mkdir(exist_ok=True)
        
        # Save ensemble model
        ensemble_path = model_dir / "advanced_ensemble_model.joblib"
        joblib.dump(self.ensemble_model, ensemble_path)
        
        # Save individual models
        for name, model in self.models.items():
            model_path = model_dir / f"{name}_model.joblib"
            joblib.dump(model, model_path)
        
        # Save scaler
        scaler_path = model_dir / "advanced_scaler.joblib"
        joblib.dump(self.scaler, scaler_path)
        
        # Save comprehensive metadata
        metadata = {
            'model_type': 'Advanced_Ensemble_SpaceMedicine',
            'ensemble_components': list(self.models.keys()),
            'target': 'bone_density_change',
            'features': self.feature_names,
            'n_features': len(self.feature_names),
            'performance': self.performance_metrics,
            'training_date': pd.Timestamp.now().isoformat(),
            'model_files': {
                'ensemble': str(ensemble_path),
                'scaler': str(scaler_path),
                'individual_models': {name: str(model_dir / f"{name}_model.joblib") 
                                     for name in self.models.keys()}
            },
            'data_quality': {
                'total_samples': self.performance_metrics['training_info']['total_samples'],
                'model_validation': 'Stratified_CV_with_source_awareness',
                'feature_engineering': 'Advanced_with_interactions'
            }
        }
        
        metadata_path = model_dir / "advanced_model_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"Advanced model suite saved to {model_dir}")
        logger.info(f"Best performance - Ensemble R²: {self.performance_metrics['ensemble']['r2']:.4f}")
        
        return metadata

def main():
    """Main training pipeline for advanced model"""
    logger.info("Starting Advanced ML Training Pipeline")
    logger.info("=" * 60)
    
    try:
        # Initialize predictor
        predictor = AdvancedSpaceMedicinePredictor()
        
        # Load expanded dataset
        X, y, sources = predictor.load_and_prepare_data('data/expanded_crew_health_data.csv')
        
        # Create ensemble models
        predictor.create_ensemble_models()
        
        # Train and validate
        results = predictor.train_and_validate(X, y, sources)
        
        # Save model suite
        metadata = predictor.save_advanced_model()
        
        logger.info("=" * 60)
        logger.info("ADVANCED ML TRAINING COMPLETED!")
        logger.info(f"Dataset size: {results['training_info']['total_samples']} samples")
        logger.info(f"Features: {results['training_info']['features']}")
        logger.info(f"Best Model (Ensemble) R²: {results['ensemble']['r2']:.4f}")
        logger.info(f"Ensemble RMSE: {results['ensemble']['rmse']:.4f}")
        logger.info(f"Cross-validation: {results['ensemble']['cv_mean']:.4f} ± {results['ensemble']['cv_std']:.4f}")
        
        return metadata
        
    except Exception as e:
        logger.error(f"Advanced training failed: {e}")
        raise

if __name__ == "__main__":
    main()
