/**
 * Simple test script for Weather API
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Running Weather API tests...\n');

  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      expected: { status: 'ok' }
    },
    {
      name: 'Get Weather by City (London)',
      url: `${BASE_URL}/api/weather?city=London`,
      expected: { city: 'London' }
    },
    {
      name: 'Get Weather by City (New York)',
      url: `${BASE_URL}/api/weather?city=New%20York`,
      expected: { city: 'New York' }
    },
    {
      name: 'Get Weather by Coordinates',
      url: `${BASE_URL}/api/weather?lat=51.5074&lon=-0.1278`,
      expected: { latitude: 51.5074 }
    },
    {
      name: 'Invalid Request (Missing Parameters)',
      url: `${BASE_URL}/api/weather`,
      expectedError: true
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios.get(test.url, {
        validateStatus: () => true // Don't throw on any status
      });

      if (test.expectedError) {
        if (response.status >= 400) {
          console.log(`✅ ${test.name} - Got expected error`);
          passed++;
        } else {
          console.log(`❌ ${test.name} - Expected error but got success`);
          failed++;
        }
      } else {
        const data = response.data;
        const key = Object.keys(test.expected)[0];
        const expectedValue = test.expected[key];
        
        if (data[key] === expectedValue || (key === 'status' && data.status === 'ok')) {
          console.log(`✅ ${test.name} - Passed`);
          if (data.temperature) {
            console.log(`   Temperature: ${data.temperature}°C`);
          }
          passed++;
        } else {
          console.log(`❌ ${test.name} - Failed`);
          console.log(`   Expected ${key}: ${expectedValue}, got: ${data[key]}`);
          failed++;
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed');
    process.exit(1);
  }
}

// Check if server is running
axios.get(`${BASE_URL}/health`)
  .then(() => {
    runTests();
  })
  .catch(() => {
    console.error('❌ Error: Weather API server is not running');
    console.error(`   Please start the server first: npm start`);
    console.error(`   Or set API_URL environment variable to point to running server`);
    process.exit(1);
  });

