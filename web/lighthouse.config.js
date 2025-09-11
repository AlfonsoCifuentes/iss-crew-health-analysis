module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/astronauts',
        'http://localhost:3000/simulators',
        'http://localhost:3000/analysis'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless'
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance requirements
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Accessibility requirements  
        'color-contrast': 'error',
        'heading-order': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        
        // Best practices
        'errors-in-console': 'warn',
        'uses-https': 'error',
        'uses-http2': 'warn',
        
        // SEO requirements
        'meta-description': 'error',
        'document-title': 'error',
        'crawlable-anchors': 'error',
        
        // PWA basics
        'service-worker': 'warn',
        'installable-manifest': 'warn',
        
        // Custom thresholds for space-themed site
        'categories.performance': ['error', { minScore: 0.85 }],
        'categories.accessibility': ['error', { minScore: 0.95 }],
        'categories.best-practices': ['error', { minScore: 0.90 }],
        'categories.seo': ['error', { minScore: 0.90 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      port: 9009,
      storage: './lighthouse-results'
    }
  }
};
