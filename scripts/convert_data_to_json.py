#!/usr/bin/env python3
"""
ISS Crew Health Data Converter
Converts processed Python data to JSON format for Next.js frontend
"""

import pandas as pd
import numpy as np
import json
import joblib
from pathlib import Path
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataConverter:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent  # Go up one level from scripts/
        self.data_path = self.base_path / "data"
        self.web_data_path = self.base_path / "web" / "src" / "data"
        
        # Create web data directory if it doesn't exist
        self.web_data_path.mkdir(parents=True, exist_ok=True)
        
    def convert_processed_data(self):
        """Convert processed crew health data to JSON"""
        logger.info("Converting processed crew health data...")
        
        try:
            # Read processed data
            df = pd.read_csv(self.data_path / "processed_crew_health_data.csv")
            
            # Convert to JSON-serializable format
            data = {
                "metadata": {
                    "total_records": len(df),
                    "total_features": len(df.columns),
                    "last_updated": datetime.now().isoformat(),
                    "source": "NASA LSDA - Life Sciences Data Archive"
                },
                "statistics": {
                    "numerical_summary": df.describe().to_dict(),
                    "missing_values": df.isnull().sum().to_dict(),
                    "data_types": df.dtypes.astype(str).to_dict()
                },
                "records": df.to_dict('records')
            }
            
            # Save to JSON
            with open(self.web_data_path / "crew_health_data.json", 'w') as f:
                json.dump(data, f, indent=2, default=str)
                
            logger.info(f"✅ Processed data converted: {len(df)} records")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error converting processed data: {e}")
            return False
            
    def convert_raw_data(self):
        """Convert raw crew health data to JSON"""
        logger.info("Converting raw crew health data...")
        
        try:
            # Read raw data
            df = pd.read_csv(self.data_path / "raw_crew_health_data.csv")
            
            # Create simplified structure for raw data
            raw_data = {
                "metadata": {
                    "total_records": len(df),
                    "source": "NASA LSDA - Raw Data",
                    "last_updated": datetime.now().isoformat()
                },
                "records": df.to_dict('records')
            }
            
            # Save to JSON
            with open(self.web_data_path / "raw_crew_data.json", 'w') as f:
                json.dump(raw_data, f, indent=2, default=str)
                
            logger.info(f"✅ Raw data converted: {len(df)} records")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error converting raw data: {e}")
            return False
            
    def extract_model_metadata(self):
        """Extract metadata from trained ML models"""
        logger.info("Extracting model metadata...")
        
        try:
            # Load trained models
            models_path = self.base_path / "models" / "trained_models.joblib"
            if models_path.exists():
                models_data = joblib.load(models_path)
                
                model_info = {
                    "metadata": {
                        "total_models": len(models_data) if isinstance(models_data, dict) else 1,
                        "last_updated": datetime.now().isoformat(),
                        "source": "Trained ML Models"
                    },
                    "models": {}
                }
                
                # If it's a dictionary of models
                if isinstance(models_data, dict):
                    for model_name, model_data in models_data.items():
                        if hasattr(model_data, 'get_params'):
                            model_info["models"][model_name] = {
                                "type": type(model_data).__name__,
                                "parameters": model_data.get_params()
                            }
                        else:
                            model_info["models"][model_name] = {
                                "type": str(type(model_data)),
                                "description": "Model metadata"
                            }
                
                # Save model info
                with open(self.web_data_path / "model_metadata.json", 'w') as f:
                    json.dump(model_info, f, indent=2, default=str)
                    
                logger.info(f"✅ Model metadata extracted")
                return True
            else:
                logger.warning("⚠️ No trained models found")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error extracting model metadata: {e}")
            return False
            
    def create_aggregated_stats(self):
        """Create aggregated statistics for dashboard"""
        logger.info("Creating aggregated statistics...")
        
        try:
            # Read processed data
            df = pd.read_csv(self.data_path / "processed_crew_health_data.csv")
            
            # Calculate key statistics
            stats = {
                "key_metrics": {
                    "total_crew_members": len(df),
                    "avg_mission_duration": float(df['mission_duration_days'].mean()) if 'mission_duration_days' in df.columns else 0,
                    "avg_age": float(df['crew_age'].mean()) if 'crew_age' in df.columns else 0,
                    "bone_density_change_avg": float(df['bone_density_change'].mean()) if 'bone_density_change' in df.columns else 0,
                    "muscle_mass_change_avg": float(df['muscle_mass_change'].mean()) if 'muscle_mass_change' in df.columns else 0
                },
                "mission_types": df['mission_type'].value_counts().to_dict() if 'mission_type' in df.columns else {},
                "crew_roles": df['crew_role'].value_counts().to_dict() if 'crew_role' in df.columns else {},
                "correlations": {
                    "bone_muscle_correlation": float(df[['bone_density_change', 'muscle_mass_change']].corr().iloc[0,1]) if all(col in df.columns for col in ['bone_density_change', 'muscle_mass_change']) else 0
                },
                "outlier_analysis": {
                    "total_outliers": int(df['outlier_consensus'].sum()) if 'outlier_consensus' in df.columns else 0,
                    "outlier_percentage": float((df['outlier_consensus'].sum() / len(df)) * 100) if 'outlier_consensus' in df.columns else 0
                }
            }
            
            # Save aggregated stats
            with open(self.web_data_path / "aggregated_stats.json", 'w') as f:
                json.dump(stats, f, indent=2, default=str)
                
            logger.info("✅ Aggregated statistics created")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating aggregated stats: {e}")
            return False
            
    def convert_reports(self):
        """Convert text reports to JSON format"""
        logger.info("Converting reports to JSON...")
        
        try:
            reports_data = {}
            reports_path = self.base_path / "reports"
            
            # Convert each report file
            for report_file in reports_path.glob("*.txt"):
                with open(report_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                reports_data[report_file.stem] = {
                    "filename": report_file.name,
                    "content": content,
                    "last_modified": datetime.fromtimestamp(report_file.stat().st_mtime).isoformat()
                }
                
            # Save reports data
            with open(self.web_data_path / "reports.json", 'w') as f:
                json.dump(reports_data, f, indent=2, default=str)
                
            logger.info(f"✅ Reports converted: {len(reports_data)} files")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error converting reports: {e}")
            return False
            
    def run_conversion(self):
        """Run complete data conversion process"""
        logger.info("🚀 Starting ISS Crew Health data conversion...")
        
        results = []
        
        # Convert all data types
        results.append(self.convert_processed_data())
        results.append(self.convert_raw_data()) 
        results.append(self.extract_model_metadata())
        results.append(self.create_aggregated_stats())
        results.append(self.convert_reports())
        
        # Summary
        successful = sum(results)
        total = len(results)
        
        logger.info(f"🎯 Conversion completed: {successful}/{total} successful")
        
        if successful == total:
            logger.info("✅ All data converted successfully! Ready for Next.js integration")
        else:
            logger.warning(f"⚠️ {total - successful} conversions failed. Check logs above.")
            
        return successful == total

if __name__ == "__main__":
    converter = DataConverter()
    success = converter.run_conversion()
    exit(0 if success else 1)
