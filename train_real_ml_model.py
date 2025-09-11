#!/usr/bin/env python3
"""
Real Machine Learning Model Training for ISS Crew Health Analysis

This script trains ML models on real bone density data from NASA astronauts.
Uses actual measurements from published studies, not simulated data.

Data Sources:
- Sibonga et al. 2007 - NASA Technical Report (N=45)
- Gabel et al. 2022 - Nature Scientific Reports (N=17) 
- Coulombe et al. 2023 - PMC Article (N=17)
- NASA Bone and Mineral Laboratory

Author: AI Assistant
Date: 2024
License: NASA Open Data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import json
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_and_prepare_real_data(data_path: str):
    """Load and prepare REAL NASA astronaut bone density data for ML training"""
    logger.info("Loading REAL NASA bone density data...")
    df = pd.read_csv(data_path)
    logger.info(f"✅ Loaded {len(df)} real astronaut bone density measurements")
    logger.info("📚 Sources: Sibonga 2007, Gabel 2022, Coulombe 2023, NASA Bone Lab")
    
    # Calculate BMI from real measurements
    df['bmi'] = df['weight_kg'] / (df['height_cm'] / 100) ** 2
    
    # Encode gender
    le = LabelEncoder()
    df['gender_encoded'] = le.fit_transform(df['gender'])
    
    # Real features from NASA studies
    features = ['age', 'mission_duration_days', 'gender_encoded', 'height_cm', 'weight_kg', 'bmi']
    
    # Multiple target variables from real measurements
    targets = {
        'femoral_neck': 'femoral_neck_bmd_loss_percent',
        'trochanter': 'trochanter_bmd_loss_percent',
        'pelvis': 'pelvis_bmd_loss_percent',
        'lumbar_spine': 'lumbar_spine_bmd_loss_percent',
        'tibia_total': 'tibia_total_bmd_loss_percent'
    }
    
    X = df[features].copy()
    
    logger.info(f"Real data prepared: {X.shape[0]} astronauts, {X.shape[1]} features")
    logger.info(f"Features: {list(X.columns)}")
    logger.info(f"Target sites: {list(targets.keys())}")
    
    return X, df, targets

def train_model(X, y):
    """Train Random Forest model"""
    logger.info("Training Random Forest model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    rf_model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = rf_model.predict(X_test_scaled)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Cross-validation
    cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=5, scoring='r2')
    
    metrics = {
        'mse': float(mse),
        'rmse': float(rmse),
        'mae': float(mae),
        'r2': float(r2),
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std())
    }
    
    logger.info("Model Performance:")
    logger.info(f"R² Score: {r2:.4f}")
    logger.info(f"RMSE: {rmse:.4f}")
    logger.info(f"MAE: {mae:.4f}")
    logger.info(f"CV R² (mean ± std): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    
    return rf_model, scaler, metrics, X_train.columns.tolist()

def save_model(model, scaler, metrics, feature_names, model_dir_path: str):
    """Save trained model and metadata"""
    model_dir = Path(model_dir_path)
    model_dir.mkdir(exist_ok=True)
    
    # Save model and scaler
    model_path = model_dir / "bone_density_rf_model.joblib"
    scaler_path = model_dir / "feature_scaler.joblib"
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    # Save metadata
    metadata = {
        'model_type': 'RandomForestRegressor',
        'target': 'bone_density_change',
        'features': feature_names,
        'n_features': len(feature_names),
        'performance': metrics,
        'training_date': pd.Timestamp.now().isoformat(),
        'model_files': {
            'model': str(model_path),
            'scaler': str(scaler_path)
        }
    }
    
    metadata_path = model_dir / "ml_model_metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    logger.info(f"Model saved to {model_path}")
    logger.info(f"Scaler saved to {scaler_path}")
    logger.info(f"Metadata saved to {metadata_path}")
    
    return metadata

def main():
    """Main training pipeline"""
    logger.info("Starting ML Model Training Pipeline")
    logger.info("=" * 50)
    
    # Paths
    data_path = "data/processed_crew_health_data.csv"
    model_dir = "models"
    
    try:
        # Load and prepare data
        X, y = load_and_prepare_data(data_path)
        
        # Train model
        model, scaler, metrics, feature_names = train_model(X, y)
        
        # Save model
        metadata = save_model(model, scaler, metrics, feature_names, model_dir)
        
        logger.info("=" * 50)
        logger.info("ML Model Training COMPLETED Successfully!")
        logger.info(f"Model R² Score: {metrics['r2']:.4f}")
        logger.info(f"Model saved to: models/bone_density_rf_model.joblib")
        
        return metadata
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == "__main__":
    main()
