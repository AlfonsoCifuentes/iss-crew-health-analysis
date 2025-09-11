import { NextRequest, NextResponse } from 'next/server'

interface PredictionRequest {
  mission_duration: number
  initial_bone_density: number
  initial_muscle_mass: number
  age: number
  exercise_hours_per_day: number
  dietary_calcium_mg: number
}

// Modelo predictivo simplificado basado en datos NASA LSDA
function predictHealthChanges(params: PredictionRequest) {
  const {
    mission_duration,
    initial_bone_density,
    initial_muscle_mass,
    age,
    exercise_hours_per_day,
    dietary_calcium_mg
  } = params

  // Factores de degradación basados en literatura científica
  const bone_degradation_rate = 0.015 // 1.5% por mes base
  const muscle_degradation_rate = 0.02 // 2% por mes base
  
  // Factores de protección
  const exercise_protection_factor = Math.min(exercise_hours_per_day * 0.1, 0.5)
  const calcium_protection_factor = Math.min(dietary_calcium_mg / 1200, 1.0) * 0.2
  const age_factor = age < 40 ? 0.8 : age > 50 ? 1.2 : 1.0

  // Cálculos predictivos
  const months_in_space = mission_duration / 30
  
  const bone_loss_rate = (bone_degradation_rate * age_factor) - exercise_protection_factor - calcium_protection_factor
  const final_bone_density = initial_bone_density * Math.pow(1 - bone_loss_rate, months_in_space)
  
  const muscle_loss_rate = (muscle_degradation_rate * age_factor) - (exercise_protection_factor * 0.8)
  const final_muscle_mass = initial_muscle_mass * Math.pow(1 - muscle_loss_rate, months_in_space)

  // Predicciones adicionales
  const cardiovascular_impact = mission_duration > 180 ? 'High' : mission_duration > 90 ? 'Moderate' : 'Low'
  const psychological_risk = mission_duration > 365 ? 'High' : mission_duration > 180 ? 'Moderate' : 'Low'
  
  // Recovery time estimation (months)
  const recovery_time = Math.ceil(months_in_space * 0.5)

  return {
    predictions: {
      bone_density: {
        initial: initial_bone_density,
        final: Math.round(final_bone_density * 1000) / 1000,
        loss_percentage: Math.round(((initial_bone_density - final_bone_density) / initial_bone_density) * 100),
        recovery_months: recovery_time
      },
      muscle_mass: {
        initial: initial_muscle_mass,
        final: Math.round(final_muscle_mass * 10) / 10,
        loss_percentage: Math.round(((initial_muscle_mass - final_muscle_mass) / initial_muscle_mass) * 100),
        recovery_months: Math.ceil(recovery_time * 0.8)
      },
      cardiovascular_impact,
      psychological_risk,
      overall_risk_score: calculateOverallRisk(bone_loss_rate, muscle_loss_rate, mission_duration),
      recommendations: generateRecommendations(exercise_hours_per_day, dietary_calcium_mg, mission_duration)
    },
    mission_parameters: params
  }
}

function calculateOverallRisk(bone_loss: number, muscle_loss: number, duration: number): number {
  const risk_score = (bone_loss * 40) + (muscle_loss * 30) + (duration / 365 * 30)
  return Math.min(Math.round(risk_score * 10) / 10, 10)
}

function generateRecommendations(exercise: number, calcium: number, duration: number): string[] {
  const recommendations = []
  
  if (exercise < 2) {
    recommendations.push('Increase daily exercise to minimum 2.5 hours')
  }
  if (calcium < 1200) {
    recommendations.push('Supplement calcium intake to 1200-1500mg daily')
  }
  if (duration > 180) {
    recommendations.push('Implement enhanced countermeasure protocols')
    recommendations.push('Regular medical monitoring every 30 days')
  }
  if (duration > 365) {
    recommendations.push('Consider rotating crew assignments')
    recommendations.push('Psychological support sessions 2x weekly')
  }
  
  return recommendations.length > 0 ? recommendations : ['Current parameters within acceptable ranges']
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json()
    
    // Validation
    if (!body.mission_duration || body.mission_duration < 1 || body.mission_duration > 900) {
      return NextResponse.json({
        success: false,
        error: 'Mission duration must be between 1 and 900 days'
      }, { status: 400 })
    }

    const predictions = predictHealthChanges(body)
    
    return NextResponse.json({
      success: true,
      data: predictions,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid request format'
    }, { status: 400 })
  }
}
