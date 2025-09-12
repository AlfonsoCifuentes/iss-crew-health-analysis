// Auto-generated data file from real_metrics.json
export const realMetrics = {
  "calculated_at": "2025-09-11T19:15:32.502089Z",
  "data_source": "NASA Life Sciences Data Archive (LSDA)",
  "astronauts_page": {
    "health_metrics_count": 9,
    "data_completeness_percent": 100
  },
  "simulators_page": {
    "ml_model_accuracy_percent": 91.8
  },
  "risk_simulator": {
    "bone_density_loss": 5.096000000000001,
    "muscle_mass_loss": 6.76,
    "trochanter_loss": 8.112,
    "pelvis_loss": 8.008,
    "tibia_loss": 1.6640000000000001,
    "calcaneus_loss": 3.016
  },
  "analytics_page": {
    "correlations": {
      "age_vs_bone_loss": 0.13,
      "duration_vs_bone_loss": -0.79,
      "femoral_vs_lumbar_loss": 0.73
    },
    "outliers": {
      "extreme_bone_loss_percent": 0,
      "rapid_recovery_percent": 0,
      "overall_outliers_percent": 0
    },
    "advanced_metrics": {
      "average_recovery_days": 151,
      "total_measurements": 50,
      "data_span_years": "2007-2023"
    }
  },
  "bone_loss_by_site": {
    "lumbar_spine": 5.1,
    "femoral_neck": 6.8,
    "trochanter": 8.1,
    "pelvis": 8,
    "tibia_total": 1.7,
    "calcaneus": 3
  },
  "dataset_info": {
    "total_astronauts": 50,
    "total_measurements": 50,
    "age_range": {
      "min": 35,
      "max": 56,
      "average": 44.9
    },
    "mission_duration_range": {
      "min": 126,
      "max": 248,
      "average": 176.5
    }
  }
} as const;
