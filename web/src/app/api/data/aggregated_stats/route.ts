import { NextResponse } from 'next/server';

// Embedded aggregated_stats.json data
const data = {
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
};

export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'application/json'
    }
  });
}