#!/usr/bin/env python3
"""
Raw Crew Data Generator - Direct CSV to JSON conversion
"""

import json
import pandas as pd

def main():
    """Generate raw_crew_data.json from real CSV files"""
    print("🚀 Converting real CSV data to raw_crew_data.json...")
    
    # Load real data
    profiles_df = pd.read_csv('data/real_astronaut_profiles.csv')
    bone_df = pd.read_csv('data/real_bone_density_measurements.csv')
    
    # Convert profiles to JSON format
    crew_profiles = []
    for _, row in profiles_df.iterrows():
        profile = {
            "id": str(row['astronaut_id']),
            "age": int(row['age']),
            "gender": str(row['gender']),
            "height_cm": float(row['height_cm']),
            "weight_kg": float(row['weight_kg']),
            "mission_duration": int(row['mission_duration_days']),
            "crew_type": str(row['crew_type']),
            "study_source": str(row['study_source'])
        }
        crew_profiles.append(profile)
    
    # Convert bone density measurements
    bone_measurements = []
    for _, row in bone_df.iterrows():
        measurement = {
            "astronaut_id": str(row['astronaut_id']),
            "mission_duration_days": int(row['mission_duration_days']),
            "age": int(row['age']),
            "gender": str(row['gender']),
            "lumbar_spine_bmd_loss": float(row['lumbar_spine_bmd_loss_percent']),
            "femoral_neck_bmd_loss": float(row['femoral_neck_bmd_loss_percent']),
            "trochanter_bmd_loss": float(row['trochanter_bmd_loss_percent']),
            "pelvis_bmd_loss": float(row['pelvis_bmd_loss_percent']),
            "tibia_total_bmd_loss": float(row['tibia_total_bmd_loss_percent']),
            "calcaneus_bmd_loss": float(row['calcaneus_bmd_loss_percent']),
            "incomplete_recovery": bool(row['incomplete_recovery']),
            "primary_data_source": str(row['primary_data_source']),
            "measurement_method": str(row['measurement_method']),
            "data_quality": str(row['data_quality'])
        }
        bone_measurements.append(measurement)
    
    # Combine into raw data structure
    raw_crew_data = {
        "metadata": {
            "source": "NASA Life Sciences Data Archive (LSDA)",
            "total_astronauts": len(profiles_df),
            "total_measurements": len(bone_df),
            "data_collection_period": "1998-2024",
            "last_updated": "2024-12-19",
            "version": "1.0.0"
        },
        "crew_profiles": crew_profiles,
        "bone_density_measurements": bone_measurements,
        "summary_statistics": {
            "average_age": float(profiles_df['age'].mean()),
            "average_mission_duration": float(profiles_df['mission_duration_days'].mean()),
            "gender_distribution": profiles_df['gender'].value_counts().to_dict(),
            "age_range": {
                "min": int(profiles_df['age'].min()),
                "max": int(profiles_df['age'].max())
            },
            "mission_duration_range": {
                "min": int(profiles_df['mission_duration_days'].min()),
                "max": int(profiles_df['mission_duration_days'].max())
            }
        }
    }
    
    # Save to web directory
    with open('web/src/data/raw_crew_data.json', 'w') as f:
        json.dump(raw_crew_data, f, indent=2)
    
    print("✅ Generated raw_crew_data.json with complete real dataset")
    print(f"   - {len(crew_profiles)} astronaut profiles")
    print(f"   - {len(bone_measurements)} bone density measurements")
    print(f"   - Age range: {raw_crew_data['summary_statistics']['age_range']['min']}-{raw_crew_data['summary_statistics']['age_range']['max']} years")
    print(f"   - Mission range: {raw_crew_data['summary_statistics']['mission_duration_range']['min']}-{raw_crew_data['summary_statistics']['mission_duration_range']['max']} days")

if __name__ == "__main__":
    main()
