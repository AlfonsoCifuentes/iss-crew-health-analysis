import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Debug API route",
    timestamp: new Date().toISOString(),
    availableFiles: Object.keys({
      'real_metrics.json': true,
      'aggregated_stats.json': true,
      'model_metadata.json': true,
      'raw_crew_data.json': true,
      'crew_health_data.json': true
    })
  });
}