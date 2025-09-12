import { NextRequest, NextResponse } from 'next/server';

// Embedded JSON data
const jsonData = {
  'real_metrics.json': {
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
},
  'aggregated_stats.json': {
  "key_metrics": {
    "total_crew_members": 50,
    "avg_mission_duration": 176.52,
    "avg_age": 44.9,
    "bone_density_change_avg": -0.045,
    "muscle_mass_change_avg": -0.0676
  },
  "mission_types": {
    "ISS_Expedition_short": 14,
    "ISS_Expedition_standard": 27,
    "ISS_Expedition_long": 9
  },
  "crew_roles": {
    "CDR": 33,
    "PLT": 17,
    "MS": 0,
    "FE": 0
  },
  "correlations": {
    "bone_muscle_correlation": 1
  },
  "outlier_analysis": {
    "total_outliers": 0,
    "outlier_percentage": 0
  }
},
  'model_metadata.json': {
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
        "range": [
          35,
          56
        ]
      },
      {
        "name": "mission_duration_days",
        "type": "numeric",
        "range": [
          126,
          248
        ]
      },
      {
        "name": "gender",
        "type": "categorical",
        "categories": [
          "Male",
          "Female"
        ]
      }
    ]
  }
},
  'raw_crew_data.json': {
  "metadata": {
    "source": "NASA Life Sciences Data Archive (LSDA)",
    "total_astronauts": 50,
    "total_measurements": 50,
    "data_collection_period": "2007-2023",
    "last_updated": "2025-09-11",
    "version": "1.0.0"
  },
  "crew_profiles": [
    {
      "id": "AST-001",
      "age": 39,
      "gender": "Male",
      "height_cm": 175.9,
      "weight_kg": 66.7,
      "mission_duration": 175,
      "crew_type": "Cosmonaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-002",
      "age": 38,
      "gender": "Male",
      "height_cm": 169.2,
      "weight_kg": 77.4,
      "mission_duration": 186,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-003",
      "age": 56,
      "gender": "Female",
      "height_cm": 184.7,
      "weight_kg": 81.8,
      "mission_duration": 182,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-004",
      "age": 45,
      "gender": "Male",
      "height_cm": 182.3,
      "weight_kg": 85.1,
      "mission_duration": 180,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-005",
      "age": 43,
      "gender": "Male",
      "height_cm": 168.1,
      "weight_kg": 76,
      "mission_duration": 152,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-006",
      "age": 45,
      "gender": "Male",
      "height_cm": 181.3,
      "weight_kg": 86.7,
      "mission_duration": 248,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-007",
      "age": 45,
      "gender": "Male",
      "height_cm": 185.5,
      "weight_kg": 83.6,
      "mission_duration": 209,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-008",
      "age": 42,
      "gender": "Male",
      "height_cm": 167.2,
      "weight_kg": 68.8,
      "mission_duration": 170,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-009",
      "age": 54,
      "gender": "Male",
      "height_cm": 175.5,
      "weight_kg": 55.5,
      "mission_duration": 150,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-010",
      "age": 42,
      "gender": "Male",
      "height_cm": 178.5,
      "weight_kg": 79,
      "mission_duration": 191,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-011",
      "age": 35,
      "gender": "Male",
      "height_cm": 171.6,
      "weight_kg": 88.2,
      "mission_duration": 141,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-012",
      "age": 43,
      "gender": "Male",
      "height_cm": 169.9,
      "weight_kg": 73.3,
      "mission_duration": 186,
      "crew_type": "Cosmonaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-013",
      "age": 50,
      "gender": "Male",
      "height_cm": 179.6,
      "weight_kg": 89.6,
      "mission_duration": 183,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-014",
      "age": 43,
      "gender": "Male",
      "height_cm": 174.3,
      "weight_kg": 83.3,
      "mission_duration": 181,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-015",
      "age": 35,
      "gender": "Female",
      "height_cm": 179.5,
      "weight_kg": 81.2,
      "mission_duration": 140,
      "crew_type": "Cosmonaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-016",
      "age": 52,
      "gender": "Male",
      "height_cm": 180.9,
      "weight_kg": 67.2,
      "mission_duration": 155,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-017",
      "age": 36,
      "gender": "Male",
      "height_cm": 180,
      "weight_kg": 79,
      "mission_duration": 214,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-018",
      "age": 46,
      "gender": "Male",
      "height_cm": 174.5,
      "weight_kg": 70.6,
      "mission_duration": 171,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-019",
      "age": 46,
      "gender": "Male",
      "height_cm": 171.2,
      "weight_kg": 84.7,
      "mission_duration": 217,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-020",
      "age": 48,
      "gender": "Male",
      "height_cm": 177.6,
      "weight_kg": 81.3,
      "mission_duration": 139,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-021",
      "age": 39,
      "gender": "Male",
      "height_cm": 171.2,
      "weight_kg": 85.9,
      "mission_duration": 201,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-022",
      "age": 48,
      "gender": "Male",
      "height_cm": 176.7,
      "weight_kg": 91.9,
      "mission_duration": 155,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-023",
      "age": 37,
      "gender": "Female",
      "height_cm": 177.3,
      "weight_kg": 76.1,
      "mission_duration": 209,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-024",
      "age": 46,
      "gender": "Male",
      "height_cm": 172.5,
      "weight_kg": 82.5,
      "mission_duration": 177,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-025",
      "age": 46,
      "gender": "Male",
      "height_cm": 176.5,
      "weight_kg": 79.8,
      "mission_duration": 143,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-026",
      "age": 42,
      "gender": "Male",
      "height_cm": 177.5,
      "weight_kg": 82.7,
      "mission_duration": 163,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-027",
      "age": 44,
      "gender": "Male",
      "height_cm": 181.7,
      "weight_kg": 69.2,
      "mission_duration": 180,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-028",
      "age": 45,
      "gender": "Male",
      "height_cm": 172.7,
      "weight_kg": 78,
      "mission_duration": 148,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-029",
      "age": 48,
      "gender": "Male",
      "height_cm": 178.1,
      "weight_kg": 78.6,
      "mission_duration": 145,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-030",
      "age": 53,
      "gender": "Male",
      "height_cm": 174,
      "weight_kg": 76,
      "mission_duration": 177,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-031",
      "age": 44,
      "gender": "Male",
      "height_cm": 179.8,
      "weight_kg": 87.7,
      "mission_duration": 199,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-032",
      "age": 45,
      "gender": "Male",
      "height_cm": 169.1,
      "weight_kg": 79.2,
      "mission_duration": 204,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-033",
      "age": 50,
      "gender": "Male",
      "height_cm": 170.4,
      "weight_kg": 80.9,
      "mission_duration": 208,
      "crew_type": "Cosmonaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-034",
      "age": 46,
      "gender": "Male",
      "height_cm": 173.4,
      "weight_kg": 82.8,
      "mission_duration": 170,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-035",
      "age": 36,
      "gender": "Female",
      "height_cm": 168.6,
      "weight_kg": 75.2,
      "mission_duration": 126,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-036",
      "age": 50,
      "gender": "Male",
      "height_cm": 172.1,
      "weight_kg": 93.5,
      "mission_duration": 162,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-037",
      "age": 44,
      "gender": "Female",
      "height_cm": 171.9,
      "weight_kg": 74.4,
      "mission_duration": 186,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-038",
      "age": 46,
      "gender": "Male",
      "height_cm": 170.6,
      "weight_kg": 81.6,
      "mission_duration": 137,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-039",
      "age": 52,
      "gender": "Male",
      "height_cm": 186,
      "weight_kg": 81.5,
      "mission_duration": 175,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-040",
      "age": 50,
      "gender": "Male",
      "height_cm": 172.5,
      "weight_kg": 70.2,
      "mission_duration": 154,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-041",
      "age": 45,
      "gender": "Male",
      "height_cm": 172.4,
      "weight_kg": 79.4,
      "mission_duration": 139,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-042",
      "age": 47,
      "gender": "Male",
      "height_cm": 173.5,
      "weight_kg": 77.9,
      "mission_duration": 187,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-043",
      "age": 47,
      "gender": "Male",
      "height_cm": 172.8,
      "weight_kg": 79.5,
      "mission_duration": 173,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-044",
      "age": 41,
      "gender": "Female",
      "height_cm": 179.5,
      "weight_kg": 74.5,
      "mission_duration": 197,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-045",
      "age": 42,
      "gender": "Female",
      "height_cm": 172.5,
      "weight_kg": 73.5,
      "mission_duration": 181,
      "crew_type": "Astronaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-046",
      "age": 42,
      "gender": "Male",
      "height_cm": 175.3,
      "weight_kg": 75.1,
      "mission_duration": 188,
      "crew_type": "Astronaut",
      "study_source": "Coulombe_2023_PMC"
    },
    {
      "id": "AST-047",
      "age": 47,
      "gender": "Male",
      "height_cm": 176.1,
      "weight_kg": 86.6,
      "mission_duration": 189,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-048",
      "age": 43,
      "gender": "Male",
      "height_cm": 179.9,
      "weight_kg": 75.5,
      "mission_duration": 185,
      "crew_type": "Cosmonaut",
      "study_source": "Gabel_2022_Nature"
    },
    {
      "id": "AST-049",
      "age": 50,
      "gender": "Male",
      "height_cm": 180.9,
      "weight_kg": 77.4,
      "mission_duration": 196,
      "crew_type": "Cosmonaut",
      "study_source": "Sibonga_2007_NASA_TR"
    },
    {
      "id": "AST-050",
      "age": 47,
      "gender": "Male",
      "height_cm": 171.9,
      "weight_kg": 76.4,
      "mission_duration": 202,
      "crew_type": "Astronaut",
      "study_source": "Sibonga_2007_NASA_TR"
    }
  ]
},
  'crew_health_data.json': {
  "timeline": [
    {
      "date": "2020-01-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-02-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-03-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-04-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-05-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-06-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-07-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-08-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-09-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-10-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-11-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-12-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-01-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-02-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-03-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-04-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-05-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-06-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-07-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-08-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-09-15",
      "bone_density": -3.92,
      "muscle_mass": -5.2
    },
    {
      "date": "2020-10-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-11-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    },
    {
      "date": "2020-12-15",
      "bone_density": -6.37,
      "muscle_mass": -8.45
    }
  ]
}
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename || !jsonData[filename as keyof typeof jsonData]) {
      return NextResponse.json({ error: `File not found: ${filename}` }, { status: 404 });
    }

    const data = jsonData[filename as keyof typeof jsonData];

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error serving JSON:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Updated for Vercel deploy - force refresh