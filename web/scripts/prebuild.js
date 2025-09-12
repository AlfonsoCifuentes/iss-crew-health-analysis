#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Pre-build script: Ensuring static files are available...');

// Verify build context
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Define paths
const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
const dataDir = path.join(publicDir, 'data');

console.log('Checking directories:');
console.log('- Public:', fs.existsSync(publicDir) ? '✅' : '❌', publicDir);
console.log('- Images:', fs.existsSync(imagesDir) ? '✅' : '❌', imagesDir);
console.log('- Data:', fs.existsSync(dataDir) ? '✅' : '❌', dataDir);

if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir);
  console.log('Image files found:', imageFiles);
}

if (fs.existsSync(dataDir)) {
  const dataFiles = fs.readdirSync(dataDir);
  console.log('Data files found:', dataFiles);
}

console.log('✅ Pre-build verification complete');