"""
ML Model Prediction Service
Wrapper class to load and use the trained Random Forest model for predictions
"""

import joblib
import pandas as pd
import numpy as np
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class BoneDensityPredictor:
    """Trained ML model for predicting bone density changes"""
    
    def __init__(self, model_dir: str = "models"):
        self.model_dir = Path(model_dir)
        self.model = None
        self.scaler = None
        self.metadata = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model, scaler, and metadata"""
        try:
            # Load model
            model_path = self.model_dir / "bone_density_rf_model.joblib"
            self.model = joblib.load(model_path)
            
            # Load scaler
            scaler_path = self.model_dir / "feature_scaler.joblib"
            self.scaler = joblib.load(scaler_path)
            
            # Load metadata
            metadata_path = self.model_dir / "ml_model_metadata.json"
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
            
            self.feature_names = self.metadata['features']
            
            logger.info("ML Model loaded successfully")
            logger.info(f"Model R² Score: {self.metadata['performance']['r2']:.4f}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def prepare_features(self, mission_duration_days: float, crew_age: int, 
                        pre_flight_bone_density: float, exercise_hours_per_week: float,
                        mission_type: str = "ISS_Expedition_standard", 
                        crew_role: str = "FE1") -> pd.DataFrame:
        """Prepare input features in the correct format for the model"""
        
        # Create base feature vector
        features = {
            'mission_duration_days': [mission_duration_days],
            'crew_age_numeric': [crew_age],
            'pre_flight_bone_density': [pre_flight_bone_density],
            'exercise_hours_per_week': [exercise_hours_per_week],
            'mission_ISS_Expedition_long': [0],
            'mission_ISS_Expedition_short': [0],
            'mission_ISS_Expedition_standard': [0],
            'role_CDR': [0],
            'role_FE1': [0],
            'role_FE2': [0],
            'role_FE3': [0]
        }
        
        # Set mission type (one-hot encoding)
        if mission_type == "ISS_Expedition_long":
            features['mission_ISS_Expedition_long'] = [1]
        elif mission_type == "ISS_Expedition_short":
            features['mission_ISS_Expedition_short'] = [1]
        else:
            features['mission_ISS_Expedition_standard'] = [1]
        
        # Set crew role (one-hot encoding)
        role_key = f'role_{crew_role}'
        if role_key in features:
            features[role_key] = [1]
        else:
            features['role_FE1'] = [1]  # Default to FE1
        
        # Create DataFrame
        df = pd.DataFrame(features)
        
        # Ensure correct order
        df = df[self.feature_names]
        
        return df
    
    def predict(self, mission_duration_days: float, crew_age: int, 
                pre_flight_bone_density: float, exercise_hours_per_week: float,
                mission_type: str = "ISS_Expedition_standard", 
                crew_role: str = "FE1") -> dict:
        """Make prediction using the trained model"""
        
        if self.model is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        try:
            # Prepare features
            X = self.prepare_features(
                mission_duration_days, crew_age, pre_flight_bone_density,
                exercise_hours_per_week, mission_type, crew_role
            )
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0]
            
            # Get feature importance for this prediction
            feature_importance = dict(zip(
                self.feature_names, 
                self.model.feature_importances_
            ))
            
            # Sort by importance
            sorted_importance = dict(sorted(
                feature_importance.items(), 
                key=lambda x: x[1], 
                reverse=True
            ))
            
            return {
                'bone_density_change': float(prediction),
                'model_info': {
                    'model_type': self.metadata['model_type'],
                    'r2_score': self.metadata['performance']['r2'],
                    'rmse': self.metadata['performance']['rmse'],
                    'training_date': self.metadata['training_date']
                },
                'feature_importance': sorted_importance,
                'input_parameters': {
                    'mission_duration_days': mission_duration_days,
                    'crew_age': crew_age,
                    'pre_flight_bone_density': pre_flight_bone_density,
                    'exercise_hours_per_week': exercise_hours_per_week,
                    'mission_type': mission_type,
                    'crew_role': crew_role
                }
            }
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        if self.metadata is None:
            return {"error": "No model loaded"}
        
        return {
            'model_type': self.metadata['model_type'],
            'target': self.metadata['target'],
            'n_features': self.metadata['n_features'],
            'performance': self.metadata['performance'],
            'training_date': self.metadata['training_date'],
            'features': self.metadata['features']
        }

# Global predictor instance
_predictor = None

def get_predictor() -> BoneDensityPredictor:
    """Get the global predictor instance (singleton pattern)"""
    global _predictor
    if _predictor is None:
        _predictor = BoneDensityPredictor()
    return _predictor

def predict_bone_density_change(mission_duration_days: float, crew_age: int, 
                               pre_flight_bone_density: float, exercise_hours_per_week: float,
                               mission_type: str = "ISS_Expedition_standard", 
                               crew_role: str = "FE1") -> dict:
    """Convenience function for making predictions"""
    predictor = get_predictor()
    return predictor.predict(
        mission_duration_days, crew_age, pre_flight_bone_density,
        exercise_hours_per_week, mission_type, crew_role
    )
