"""
Predictive Modeling Module for ISS Crew Health Analysis
Implements regression models and predictive analytics for space medicine
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import logging

logger = logging.getLogger(__name__)

class CrewHealthPredictor:
    """Class for predictive modeling of crew health metrics"""
    
    def __init__(self):
        self.models = {}
        self.trained_models = {}
        self.results = {}
        self.scaler = StandardScaler()
        
        # Initialize models
        self.models = {
            'linear_regression': LinearRegression(),
            'ridge_regression': Ridge(alpha=1.0),
            'lasso_regression': Lasso(alpha=1.0),
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'svr': SVR(kernel='rbf')
        }
    
    def prepare_features_target(self, df: pd.DataFrame, 
                              target_col: str) -> tuple:
        """
        Prepare features and target variables for modeling
        
        Args:
            df: DataFrame containing the data
            target_col: Name of the target column
            
        Returns:
            Tuple of (X, y) where X is features and y is target
        """
        if target_col not in df.columns:
            raise ValueError(f"Target column '{target_col}' not found in DataFrame")
        
        # Separate features and target
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        # Select only numerical features
        numerical_cols = X.select_dtypes(include=[np.number]).columns
        X = X[numerical_cols]
        
        # Remove any remaining NaN values
        mask = ~(X.isnull().any(axis=1) | y.isnull())
        X = X[mask]
        y = y[mask]
        
        logger.info(f"Prepared {len(X)} samples with {len(X.columns)} features")
        logger.info(f"Target variable: {target_col}")
        
        return X, y
    
    def train_models(self, X: pd.DataFrame, y: pd.Series, 
                    test_size: float = 0.2) -> dict:
        """
        Train multiple regression models
        
        Args:
            X: Features DataFrame
            y: Target Series
            test_size: Proportion of data for testing
            
        Returns:
            Dictionary containing model performance metrics
        """
        logger.info("Starting model training...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        results = {}
        
        for name, model in self.models.items():
            logger.info(f"Training {name}...")
            
            try:
                # Train model
                if name in ['linear_regression', 'ridge_regression', 'lasso_regression', 'svr']:
                    # These models benefit from scaling
                    model.fit(X_train_scaled, y_train)
                    y_pred = model.predict(X_test_scaled)
                else:
                    # Tree-based models don't need scaling
                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_test)
                
                # Calculate metrics
                mse = mean_squared_error(y_test, y_pred)
                rmse = np.sqrt(mse)
                mae = mean_absolute_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                # Cross-validation
                if name in ['linear_regression', 'ridge_regression', 'lasso_regression', 'svr']:
                    cv_scores = cross_val_score(model, X_train_scaled, y_train, 
                                              cv=5, scoring='r2')
                else:
                    cv_scores = cross_val_score(model, X_train, y_train, 
                                              cv=5, scoring='r2')
                
                results[name] = {
                    'mse': mse,
                    'rmse': rmse,
                    'mae': mae,
                    'r2': r2,
                    'cv_score_mean': cv_scores.mean(),
                    'cv_score_std': cv_scores.std(),
                    'predictions': y_pred,
                    'actual': y_test.values
                }
                
                # Store trained model
                self.trained_models[name] = model
                
                logger.info(f"{name} - R²: {r2:.4f}, RMSE: {rmse:.4f}")
                
            except Exception as e:
                logger.error(f"Error training {name}: {e}")
                continue
        
        self.results = results
        return results
    
    def plot_model_comparison(self) -> None:
        """Plot comparison of model performances"""
        if not self.results:
            logger.warning("No results available. Train models first.")
            return
        
        # Extract metrics
        models = list(self.results.keys())
        r2_scores = [self.results[model]['r2'] for model in models]
        rmse_scores = [self.results[model]['rmse'] for model in models]
        
        # Create subplots
        fig, axes = plt.subplots(1, 2, figsize=(15, 6))
        
        # R² scores
        bars1 = axes[0].bar(models, r2_scores, color='skyblue', alpha=0.7)
        axes[0].set_title('Model Comparison - R² Score')
        axes[0].set_ylabel('R² Score')
        axes[0].tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for bar, score in zip(bars1, r2_scores):
            axes[0].text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.01,
                        f'{score:.3f}', ha='center', va='bottom')
        
        # RMSE scores
        bars2 = axes[1].bar(models, rmse_scores, color='lightcoral', alpha=0.7)
        axes[1].set_title('Model Comparison - RMSE')
        axes[1].set_ylabel('RMSE')
        axes[1].tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for bar, score in zip(bars2, rmse_scores):
            axes[1].text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.01,
                        f'{score:.3f}', ha='center', va='bottom')
        
        plt.tight_layout()
        plt.show()
    
    def plot_prediction_vs_actual(self, model_name: str) -> None:
        """
        Plot predictions vs actual values for a specific model
        
        Args:
            model_name: Name of the model to plot
        """
        if model_name not in self.results:
            logger.error(f"Model {model_name} not found in results")
            return
        
        predictions = self.results[model_name]['predictions']
        actual = self.results[model_name]['actual']
        r2 = self.results[model_name]['r2']
        
        plt.figure(figsize=(10, 8))
        
        # Scatter plot
        plt.scatter(actual, predictions, alpha=0.6, color='blue')
        
        # Perfect prediction line
        min_val = min(min(actual), min(predictions))
        max_val = max(max(actual), max(predictions))
        plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2)
        
        plt.xlabel('Actual Values')
        plt.ylabel('Predicted Values')
        plt.title(f'Predictions vs Actual - {model_name.title()}\nR² = {r2:.4f}')
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()
    
    def feature_importance_analysis(self, model_name: str, 
                                  feature_names: list) -> pd.DataFrame:
        """
        Analyze feature importance for tree-based models
        
        Args:
            model_name: Name of the model
            feature_names: List of feature names
            
        Returns:
            DataFrame with feature importance
        """
        if model_name not in self.trained_models:
            logger.error(f"Model {model_name} not found")
            return pd.DataFrame()
        
        model = self.trained_models[model_name]
        
        if not hasattr(model, 'feature_importances_'):
            logger.error(f"Model {model_name} doesn't support feature importance")
            return pd.DataFrame()
        
        # Get feature importance
        importance = model.feature_importances_
        feature_importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        # Plot feature importance
        plt.figure(figsize=(10, 6))
        sns.barplot(data=feature_importance_df.head(10), 
                   x='importance', y='feature')
        plt.title(f'Top 10 Feature Importance - {model_name.title()}')
        plt.xlabel('Importance')
        plt.tight_layout()
        plt.show()
        
        return feature_importance_df
    
    def hyperparameter_tuning(self, X: pd.DataFrame, y: pd.Series, 
                             model_name: str) -> dict:
        """
        Perform hyperparameter tuning for a specific model
        
        Args:
            X: Features DataFrame
            y: Target Series
            model_name: Name of the model to tune
            
        Returns:
            Dictionary containing best parameters and score
        """
        if model_name not in self.models:
            logger.error(f"Model {model_name} not found")
            return {}
        
        logger.info(f"Performing hyperparameter tuning for {model_name}...")
        
        # Define parameter grids
        param_grids = {
            'random_forest': {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'gradient_boosting': {
                'n_estimators': [50, 100, 200],
                'learning_rate': [0.01, 0.1, 0.2],
                'max_depth': [3, 5, 7],
                'min_samples_split': [2, 5, 10]
            },
            'ridge_regression': {
                'alpha': [0.1, 1.0, 10.0, 100.0, 1000.0]
            },
            'lasso_regression': {
                'alpha': [0.01, 0.1, 1.0, 10.0, 100.0]
            }
        }
        
        if model_name not in param_grids:
            logger.warning(f"No parameter grid defined for {model_name}")
            return {}
        
        # Perform grid search
        model = self.models[model_name]
        param_grid = param_grids[model_name]
        
        grid_search = GridSearchCV(
            model, param_grid, cv=5, scoring='r2', n_jobs=-1
        )
        
        # Scale data for models that need it
        if model_name in ['ridge_regression', 'lasso_regression']:
            X_scaled = self.scaler.fit_transform(X)
            grid_search.fit(X_scaled, y)
        else:
            grid_search.fit(X, y)
        
        results = {
            'best_params': grid_search.best_params_,
            'best_score': grid_search.best_score_,
            'best_estimator': grid_search.best_estimator_
        }
        
        logger.info(f"Best parameters for {model_name}: {results['best_params']}")
        logger.info(f"Best score: {results['best_score']:.4f}")
        
        return results
    
    def predict_mars_mission_effects(self, mars_duration_days: int = 780) -> dict:
        """
        Predict physiological effects for Mars mission duration
        
        Args:
            mars_duration_days: Duration of Mars mission in days (default: ~2.1 years)
            
        Returns:
            Dictionary containing predictions for different models
        """
        logger.info(f"Predicting effects for {mars_duration_days}-day Mars mission...")
        
        if not self.trained_models:
            logger.error("No trained models available. Train models first.")
            return {}
        
        # Create feature vector for Mars mission
        # This is a simplified example - in reality, you'd need more features
        mars_features = np.array([[mars_duration_days]])  # Add more features as needed
        
        predictions = {}
        
        for name, model in self.trained_models.items():
            try:
                if name in ['linear_regression', 'ridge_regression', 'lasso_regression', 'svr']:
                    # Scale features for models that need it
                    mars_features_scaled = self.scaler.transform(mars_features)
                    pred = model.predict(mars_features_scaled)[0]
                else:
                    pred = model.predict(mars_features)[0]
                
                predictions[name] = pred
                
            except Exception as e:
                logger.error(f"Error predicting with {name}: {e}")
                continue
        
        return predictions
    
    def save_models(self, filepath: str) -> None:
        """
        Save trained models to file
        
        Args:
            filepath: Path to save the models
        """
        model_data = {
            'trained_models': self.trained_models,
            'scaler': self.scaler,
            'results': self.results
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Models saved to {filepath}")
    
    def load_models(self, filepath: str) -> None:
        """
        Load trained models from file
        
        Args:
            filepath: Path to load the models from
        """
        model_data = joblib.load(filepath)
        
        self.trained_models = model_data['trained_models']
        self.scaler = model_data['scaler']
        self.results = model_data['results']
        
        logger.info(f"Models loaded from {filepath}")

if __name__ == "__main__":
    # Example usage
    predictor = CrewHealthPredictor()
    
    # Create sample data
    np.random.seed(42)
    sample_data = pd.DataFrame({
        'mission_duration_days': np.random.normal(200, 50, 100),
        'crew_age': np.random.randint(25, 50, 100),
        'pre_flight_bone_density': np.random.normal(100, 10, 100),
        'exercise_hours_per_week': np.random.normal(10, 2, 100),
        'bone_density_change': np.random.normal(-6, 2, 100)  # Target variable
    })
    
    # Prepare data
    X, y = predictor.prepare_features_target(sample_data, 'bone_density_change')
    
    # Train models
    results = predictor.train_models(X, y)
    
    # Plot comparisons
    predictor.plot_model_comparison()
    
    # Mars mission prediction
    mars_predictions = predictor.predict_mars_mission_effects()
    print(f"Mars Mission Bone Density Change Predictions: {mars_predictions}")
