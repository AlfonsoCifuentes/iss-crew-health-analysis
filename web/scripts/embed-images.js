const fs = require('fs');
const path = require('path');

// Read images and convert to base64
const imagePaths = {
  'iss_hero.jpg': './public/images/iss_hero.jpg',
  'iss_icon.png': './public/images/iss_icon.png'
};

const base64Images = {};

for (const [filename, filepath] of Object.entries(imagePaths)) {
  try {
    const buffer = fs.readFileSync(filepath);
    base64Images[filename] = buffer.toString('base64');
    console.log(`✅ ${filename}: ${Math.round(buffer.length / 1024)}KB -> ${Math.round(base64Images[filename].length / 1024)}KB base64`);
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message);
  }
}

// Generate the API route code
const apiRouteCode = `import { NextRequest, NextResponse } from 'next/server';

// Base64 encoded images
const images = {
${Object.entries(base64Images).map(([filename, base64]) => 
  `  '${filename}': '${base64}'`
).join(',\n')}
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename || !images[filename as keyof typeof images]) {
      return NextResponse.json({ error: \`File not found: \${filename}\` }, { status: 404 });
    }

    const base64Data = images[filename as keyof typeof images];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (filename.endsWith('.png')) {
      contentType = 'image/png';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

fs.writeFileSync('./src/app/api/images/[filename]/route.ts', apiRouteCode);
console.log('✅ API route updated with embedded images');