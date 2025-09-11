"""
Main Analysis Pipeline for ISS Crew Health Analysis
Orchestrates the complete data science workflow
"""

import pandas as pd
import numpy as np
import logging
from pathlib import Path
import sys
import os

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.data_acquisition import NASALSDAClient, fetch_iss_crew_data
from src.data_preprocessing import CrewHealthDataProcessor
from src.exploratory_analysis import CrewHealthEDA
from src.predictive_modeling import CrewHealthPredictor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('iss_crew_analysis.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class ISSCrewHealthPipeline:
    """Complete analysis pipeline for ISS crew health data"""
    
    def __init__(self, data_dir: str = "data", models_dir: str = "models", 
                 reports_dir: str = "reports"):
        self.data_dir = Path(data_dir)
        self.models_dir = Path(models_dir)
        self.reports_dir = Path(reports_dir)
        
        # Create directories if they don't exist
        for dir_path in [self.data_dir, self.models_dir, self.reports_dir]:
            dir_path.mkdir(exist_ok=True)
        
        # Initialize components
        self.data_client = NASALSDAClient()
        self.preprocessor = CrewHealthDataProcessor()
        self.eda_analyzer = CrewHealthEDA()
        self.predictor = CrewHealthPredictor()
        
        logger.info("ISS Crew Health Analysis Pipeline initialized")
    
    def step_1_data_acquisition(self, save_raw: bool = True) -> pd.DataFrame:
        """
        Step 1: Acquire data from NASA LSDA
        
        Args:
            save_raw: Whether to save raw data to file
            
        Returns:
            Raw data DataFrame
        """
        logger.info("=" * 50)
        logger.info("STEP 1: DATA ACQUISITION")
        logger.info("=" * 50)
        
        # Fetch ISS crew health data
        raw_data = fetch_iss_crew_data()
        
        if save_raw and not raw_data.empty:
            raw_data_path = self.data_dir / "raw_crew_health_data.csv"
            raw_data.to_csv(raw_data_path, index=False)
            logger.info(f"Raw data saved to {raw_data_path}")
        
        logger.info(f"Data acquisition completed: {len(raw_data)} records fetched")
        return raw_data
    
    def step_2_data_preprocessing(self, raw_data: pd.DataFrame, 
                                save_processed: bool = True) -> pd.DataFrame:
        """
        Step 2: Preprocess and clean the data
        
        Args:
            raw_data: Raw data DataFrame
            save_processed: Whether to save processed data
            
        Returns:
            Processed data DataFrame
        """
        logger.info("=" * 50)
        logger.info("STEP 2: DATA PREPROCESSING")
        logger.info("=" * 50)
        
        # Run preprocessing pipeline
        processed_data = self.preprocessor.preprocess_pipeline(raw_data)
        
        if save_processed and not processed_data.empty:
            processed_data_path = self.data_dir / "processed_crew_health_data.csv"
            processed_data.to_csv(processed_data_path, index=False)
            logger.info(f"Processed data saved to {processed_data_path}")
        
        logger.info("Data preprocessing completed successfully")
        return processed_data
    
    def step_3_exploratory_analysis(self, processed_data: pd.DataFrame) -> str:
        """
        Step 3: Perform exploratory data analysis
        
        Args:
            processed_data: Processed data DataFrame
            
        Returns:
            EDA report string
        """
        logger.info("=" * 50)
        logger.info("STEP 3: EXPLORATORY DATA ANALYSIS")
        logger.info("=" * 50)
        
        # Run complete EDA
        self.eda_analyzer.run_complete_eda(processed_data)
        
        # Generate report
        eda_report = self.eda_analyzer.generate_comprehensive_report(processed_data)
        
        # Save report
        report_path = self.reports_dir / "eda_report.txt"
        with open(report_path, 'w') as f:
            f.write(eda_report)
        logger.info(f"EDA report saved to {report_path}")
        
        return eda_report
    
    def step_4_predictive_modeling(self, processed_data: pd.DataFrame, 
                                 target_column: str = None) -> dict:
        """
        Step 4: Build and evaluate predictive models
        
        Args:
            processed_data: Processed data DataFrame
            target_column: Column to predict (if None, will try to find suitable target)
            
        Returns:
            Dictionary containing model results
        """
        logger.info("=" * 50)
        logger.info("STEP 4: PREDICTIVE MODELING")
        logger.info("=" * 50)
        
        # Find suitable target column if not specified
        if target_column is None:
            potential_targets = [col for col in processed_data.columns 
                               if 'change' in col.lower() or 'loss' in col.lower()]
            if potential_targets:
                target_column = potential_targets[0]
                logger.info(f"Auto-selected target column: {target_column}")
            else:
                logger.error("No suitable target column found")
                return {}
        
        if target_column not in processed_data.columns:
            logger.error(f"Target column {target_column} not found")
            return {}
        
        # Prepare features and target
        X, y = self.predictor.prepare_features_target(processed_data, target_column)
        
        if len(X) == 0:
            logger.error("No valid data for modeling")
            return {}
        
        # Train models
        results = self.predictor.train_models(X, y)
        
        # Generate model comparison plots
        self.predictor.plot_model_comparison()
        
        # Save models
        models_path = self.models_dir / "trained_models.joblib"
        self.predictor.save_models(models_path)
        
        # Generate model report
        model_report = self.generate_model_report(results)
        report_path = self.reports_dir / "model_performance_report.txt"
        with open(report_path, 'w') as f:
            f.write(model_report)
        
        logger.info("Predictive modeling completed successfully")
        return results
    
    def step_5_mars_mission_prediction(self) -> dict:
        """
        Step 5: Predict effects for Mars mission
        
        Returns:
            Dictionary containing Mars mission predictions
        """
        logger.info("=" * 50)
        logger.info("STEP 5: MARS MISSION PREDICTIONS")
        logger.info("=" * 50)
        
        # Predict for various Mars mission durations
        mission_durations = [500, 600, 700, 800, 900]  # Different mission scenarios
        mars_predictions = {}
        
        for duration in mission_durations:
            predictions = self.predictor.predict_mars_mission_effects(duration)
            mars_predictions[f"{duration}_days"] = predictions
            logger.info(f"Predictions for {duration}-day mission: {predictions}")
        
        # Save predictions
        mars_report = self.generate_mars_mission_report(mars_predictions)
        report_path = self.reports_dir / "mars_mission_predictions.txt"
        with open(report_path, 'w') as f:
            f.write(mars_report)
        
        logger.info("Mars mission predictions completed")
        return mars_predictions
    
    def generate_model_report(self, results: dict) -> str:
        """Generate comprehensive model performance report"""
        report = []
        report.append("=" * 60)
        report.append("PREDICTIVE MODELING PERFORMANCE REPORT")
        report.append("=" * 60)
        
        for model_name, metrics in results.items():
            report.append(f"\n{model_name.upper().replace('_', ' ')}:")
            report.append(f"  R² Score: {metrics['r2']:.4f}")
            report.append(f"  RMSE: {metrics['rmse']:.4f}")
            report.append(f"  MAE: {metrics['mae']:.4f}")
            report.append(f"  Cross-Validation Score: {metrics['cv_score_mean']:.4f} ± {metrics['cv_score_std']:.4f}")
        
        # Find best model
        best_model = max(results.keys(), key=lambda x: results[x]['r2'])
        report.append(f"\nBEST PERFORMING MODEL: {best_model.upper().replace('_', ' ')}")
        report.append(f"Best R² Score: {results[best_model]['r2']:.4f}")
        
        return "\n".join(report)
    
    def generate_mars_mission_report(self, mars_predictions: dict) -> str:
        """Generate Mars mission predictions report"""
        report = []
        report.append("=" * 60)
        report.append("MARS MISSION PHYSIOLOGICAL IMPACT PREDICTIONS")
        report.append("=" * 60)
        
        for duration, predictions in mars_predictions.items():
            days = duration.split('_')[0]
            years = int(days) / 365.25
            
            report.append(f"\n{days} DAYS ({years:.1f} YEARS) MISSION:")
            if predictions:
                for model, prediction in predictions.items():
                    report.append(f"  {model.replace('_', ' ').title()}: {prediction:.2f}")
            else:
                report.append("  No predictions available")
        
        report.append("\nNOTE: These predictions are based on historical ISS data")
        report.append("and should be validated with additional research.")
        
        return "\n".join(report)
    
    def run_complete_pipeline(self, use_sample_data: bool = False) -> dict:
        """
        Run the complete analysis pipeline
        
        Args:
            use_sample_data: Whether to use sample data instead of real API data
            
        Returns:
            Dictionary containing all results
        """
        logger.info("STARTING COMPLETE ISS CREW HEALTH ANALYSIS PIPELINE")
        logger.info("=" * 60)
        
        results = {}
        
        try:
            # Step 1: Data Acquisition
            if use_sample_data:
                raw_data = self.create_sample_data()
            else:
                raw_data = self.step_1_data_acquisition()
            
            if raw_data.empty:
                logger.error("No data available. Falling back to sample data.")
                raw_data = self.create_sample_data()
            
            results['raw_data'] = raw_data
            
            # Step 2: Data Preprocessing
            processed_data = self.step_2_data_preprocessing(raw_data)
            results['processed_data'] = processed_data
            
            # Step 3: Exploratory Data Analysis
            eda_report = self.step_3_exploratory_analysis(processed_data)
            results['eda_report'] = eda_report
            
            # Step 4: Predictive Modeling
            model_results = self.step_4_predictive_modeling(processed_data)
            results['model_results'] = model_results
            
            # Step 5: Mars Mission Predictions
            mars_predictions = self.step_5_mars_mission_prediction()
            results['mars_predictions'] = mars_predictions
            
            logger.info("PIPELINE COMPLETED SUCCESSFULLY!")
            
        except Exception as e:
            logger.error(f"Pipeline failed with error: {e}")
            raise
        
        return results
    
    def create_sample_data(self) -> pd.DataFrame:
        """Create sample data for demonstration purposes"""
        logger.info("Creating sample data for demonstration...")
        
        np.random.seed(42)
        n_samples = 200
        
        # Generate realistic sample data
        sample_data = pd.DataFrame({
            'mission_duration_days': np.random.gamma(2, 100),  # Skewed towards shorter missions
            'crew_age': np.random.randint(25, 55, n_samples),
            'pre_flight_bone_density': np.random.normal(100, 10, n_samples),
            'exercise_hours_per_week': np.random.gamma(2, 5),
            'bone_density_change': np.random.normal(-6, 3, n_samples),
            'muscle_mass_change': np.random.normal(-12, 4, n_samples),
            'cardiovascular_change': np.random.normal(-2, 1, n_samples),
            'psychological_score_change': np.random.normal(-1, 2, n_samples)
        })
        
        # Add some correlations to make it more realistic
        sample_data['bone_density_change'] += (
            -0.02 * sample_data['mission_duration_days'] + 
            0.05 * sample_data['exercise_hours_per_week'] +
            np.random.normal(0, 1, n_samples)
        )
        
        sample_data['muscle_mass_change'] += (
            -0.03 * sample_data['mission_duration_days'] +
            0.1 * sample_data['exercise_hours_per_week'] +
            np.random.normal(0, 2, n_samples)
        )
        
        logger.info(f"Created sample dataset with {len(sample_data)} records")
        return sample_data

def main():
    """Main execution function"""
    # Initialize pipeline
    pipeline = ISSCrewHealthPipeline()
    
    # Run complete analysis (using real NASA LSDA data)
    results = pipeline.run_complete_pipeline(use_sample_data=False)
    
    print("\n" + "="*60)
    print("ISS CREW HEALTH ANALYSIS COMPLETED!")
    print("="*60)
    print(f"Check the following directories for results:")
    print(f"- Data: {pipeline.data_dir}")
    print(f"- Models: {pipeline.models_dir}")
    print(f"- Reports: {pipeline.reports_dir}")

if __name__ == "__main__":
    main()
