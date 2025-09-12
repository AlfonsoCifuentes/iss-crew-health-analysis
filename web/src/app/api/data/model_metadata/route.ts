import { NextResponse } from 'next/server';

// Embedded model_metadata.json data
const data = {
  "model_info": {
    "name": "ISS Bone Density Prediction Model",
    "version": "1.0.0",
    "type": "Random Forest Ensemble",
    "training_date": "2025-09-11",
    "data_source": "NASA Life Sciences Data Archive (LSDA)"
  },
  "performance_metrics": {
    "r2_score": 0.918,
    "rmse": 0.41,
    "mae": 0.18
  },
  "training_data": {
    "total_samples": 50,
    "total_astronauts": 50,
    "training_period": "2007-2023",
    "data_completeness": "100%"
  },
  "features": {
    "input_features": [
      {
        "name": "age",
        "type": "numeric",
        "range": [35, 56]
      },
      {
        "name": "mission_duration_days",
        "type": "numeric",
        "range": [126, 248]
      },
      {
        "name": "gender",
        "type": "categorical",
        "categories": ["Male", "Female"]
      }
    ]
  }
};

export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'application/json'
    }
  });
}