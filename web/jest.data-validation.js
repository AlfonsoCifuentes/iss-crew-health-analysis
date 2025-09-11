/**
 * Jest Data Validation Setup
 * Ensures all tests validate NASA data authenticity
 * NO HARDCODED VALUES ALLOWED in tests
 */

// Global test validation for NASA data authenticity
global.validateNASAData = (data) => {
  if (!data) {
    throw new Error('Data is required for NASA validation');
  }

  // Check for hardcoded indicators
  const dataString = JSON.stringify(data);
  const forbiddenTerms = [
    'hardcoded', 'fake', 'simulated', 'placeholder', 'mock', 'dummy',
    'example', 'test-data', 'sample-data'
  ];

  forbiddenTerms.forEach(term => {
    if (dataString.toLowerCase().includes(term)) {
      throw new Error(`Found forbidden term "${term}" in data. Only real NASA data allowed.`);
    }
  });

  return true;
};

// Global test setup for data sources
global.validateDataSource = (source) => {
  const validSources = [
    'NASA LSDA',
    'NASA Life Sciences Data Archive',
    'Sibonga et al. 2007',
    'Gabel et al. 2022',
    'Coulombe et al. 2023',
    'NASA Bone and Mineral Laboratory'
  ];

  const hasValidSource = validSources.some(validSource => 
    source.includes(validSource)
  );

  if (!hasValidSource) {
    throw new Error(`Invalid data source: ${source}. Must be from verified NASA sources.`);
  }

  return true;
};

console.log('✅ NASA Data Validation setup loaded');
