import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    if (!filename || !filename.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid JSON file request' }, { status: 400 });
    }

    // Define file path in public/data
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Data file not found: ${filePath}`);
      return NextResponse.json({ error: `Data file not found: ${filename}` }, { status: 404 });
    }

    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // Return JSON with appropriate headers
    return NextResponse.json(jsonData, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error serving data file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}