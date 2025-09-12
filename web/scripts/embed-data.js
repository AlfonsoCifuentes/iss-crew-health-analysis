const fs = require('fs');

// Read JSON files
const jsonFiles = {
  'real_metrics.json': './public/data/real_metrics.json',
  'aggregated_stats.json': './public/data/aggregated_stats.json', 
  'model_metadata.json': './public/data/model_metadata.json',
  'raw_crew_data.json': './public/data/raw_crew_data.json',
  'crew_health_data.json': './public/data/crew_health_data.json'
};

const jsonData = {};

for (const [filename, filepath] of Object.entries(jsonFiles)) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    jsonData[filename] = JSON.parse(content);
    console.log(`✅ ${filename}: ${Math.round(content.length / 1024)}KB`);
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message);
  }
}

// Generate the API route code
const apiRouteCode = `import { NextRequest, NextResponse } from 'next/server';

// Embedded JSON data
const jsonData = {
${Object.entries(jsonData).map(([filename, data]) => 
  `  '${filename}': ${JSON.stringify(data, null, 2)}`
).join(',\n')}
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename || !jsonData[filename as keyof typeof jsonData]) {
      return NextResponse.json({ error: \`File not found: \${filename}\` }, { status: 404 });
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
}`;

fs.writeFileSync('./src/app/api/data/[filename]/route.ts', apiRouteCode);
console.log('✅ Data API route updated with embedded JSON');