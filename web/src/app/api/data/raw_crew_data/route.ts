import { NextResponse } from 'next/server';

// Embedded raw_crew_data.json data  
const data = {
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
    }
  ]
};

export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'application/json'
    }
  });
}