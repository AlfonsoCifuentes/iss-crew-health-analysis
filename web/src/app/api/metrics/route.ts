import { NextResponse } from 'next/server'

// Simulamos datos de métricas en tiempo real
export async function GET() {
  try {
    // Generate real-time mock metrics
    const currentTime = new Date().toISOString();
    
    const metrics = {
      timestamp: currentTime,
      crew_status: {
        total_crew: 7,
        active_missions: 3,
        health_alerts: Math.floor(Math.random() * 3),
        overall_status: ['Nominal', 'Caution', 'Warning'][Math.floor(Math.random() * 3)]
      },
      health_metrics: {
        bone_density: {
          current: (Math.random() * 20 + 80).toFixed(1),
          trend: Math.random() > 0.5 ? 'improving' : 'declining',
          change_24h: `${(Math.random() * 4 - 2).toFixed(1)}%`
        },
        muscle_mass: {
          current: (Math.random() * 15 + 85).toFixed(1),
          trend: Math.random() > 0.5 ? 'stable' : 'declining',
          change_24h: `${(Math.random() * 3 - 1.5).toFixed(1)}%`
        },
        cardiovascular: {
          current: (Math.random() * 10 + 90).toFixed(1),
          trend: 'stable',
          change_24h: `${(Math.random() * 2 - 1).toFixed(1)}%`
        },
        psychological: {
          current: (Math.random() * 20 + 75).toFixed(1),
          trend: Math.random() > 0.7 ? 'improving' : 'stable',
          change_24h: `${(Math.random() * 5 - 2.5).toFixed(1)}%`
        }
      },
      alerts: [
        {
          id: 1,
          type: 'info',
          message: 'Routine health assessment scheduled for ISS-069',
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
        },
        {
          id: 2,
          type: 'warning',
          message: 'Exercise equipment maintenance required',
          timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString()
        }
      ].filter(() => Math.random() > 0.5), // Randomly show 0-2 alerts
      system_status: {
        data_quality: (Math.random() * 10 + 90).toFixed(1) + '%',
        last_update: currentTime,
        connection_status: 'Connected',
        processing_time: (Math.random() * 100 + 50).toFixed(0) + 'ms'
      }
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Metrics generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}
