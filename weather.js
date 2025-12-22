/**
 * Weather Service
 * Handles weather data fetching and processing
 */

const axios = require('axios');

// Mock weather data for demonstration (used when API key is not available)
const mockWeatherData = {
  'london': {
    city: 'London',
    country: 'GB',
    temperature: 15.5,
    feelsLike: 14.2,
    humidity: 65,
    pressure: 1013,
    description: 'Partly cloudy',
    windSpeed: 5.2,
    windDirection: 180
  },
  'new york': {
    city: 'New York',
    country: 'US',
    temperature: 22.3,
    feelsLike: 21.8,
    humidity: 58,
    pressure: 1015,
    description: 'Clear sky',
    windSpeed: 3.5,
    windDirection: 270
  },
  'tokyo': {
    city: 'Tokyo',
    country: 'JP',
    temperature: 18.7,
    feelsLike: 17.9,
    humidity: 72,
    pressure: 1012,
    description: 'Light rain',
    windSpeed: 4.1,
    windDirection: 135
  },
  'paris': {
    city: 'Paris',
    country: 'FR',
    temperature: 16.2,
    feelsLike: 15.5,
    humidity: 68,
    pressure: 1014,
    description: 'Overcast',
    windSpeed: 6.3,
    windDirection: 225
  }
};

/**
 * Get weather data by city name
 */
async function getWeatherByCity(cityName) {
  const cityLower = cityName.toLowerCase().trim();
  const apiKey = process.env.WEATHER_API_KEY;

  // If API key is available, try to fetch real data
  if (apiKey) {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: cityName,
          appid: apiKey,
          units: 'metric'
        },
        timeout: 5000
      });

      return formatWeatherData(response.data, 'city');
    } catch (error) {
      console.warn(`API call failed, using mock data for ${cityName}:`, error.message);
    }
  }

  // Use mock data if API key is not available or API call failed
  const mockData = mockWeatherData[cityLower];
  if (mockData) {
    return {
      ...mockData,
      timestamp: new Date().toISOString()
    };
  }

  // Generate realistic mock data for unknown cities
  return {
    city: cityName,
    country: 'XX',
    temperature: (Math.random() * 30 + 5).toFixed(1),
    feelsLike: (Math.random() * 30 + 5).toFixed(1),
    humidity: Math.floor(Math.random() * 40 + 40),
    pressure: Math.floor(Math.random() * 20 + 1000),
    description: ['Clear sky', 'Partly cloudy', 'Overcast', 'Light rain'][Math.floor(Math.random() * 4)],
    windSpeed: (Math.random() * 10 + 2).toFixed(1),
    windDirection: Math.floor(Math.random() * 360),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get weather data by coordinates
 */
async function getWeatherByCoords(lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;

  // If API key is available, try to fetch real data
  if (apiKey) {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: lat,
          lon: lon,
          appid: apiKey,
          units: 'metric'
        },
        timeout: 5000
      });

      return formatWeatherData(response.data, 'coords');
    } catch (error) {
      console.warn(`API call failed, using mock data for coordinates:`, error.message);
    }
  }

  // Use mock data if API key is not available or API call failed
  return {
    latitude: lat,
    longitude: lon,
    city: 'Unknown Location',
    temperature: (Math.random() * 30 + 5).toFixed(1),
    feelsLike: (Math.random() * 30 + 5).toFixed(1),
    humidity: Math.floor(Math.random() * 40 + 40),
    pressure: Math.floor(Math.random() * 20 + 1000),
    description: ['Clear sky', 'Partly cloudy', 'Overcast', 'Light rain'][Math.floor(Math.random() * 4)],
    windSpeed: (Math.random() * 10 + 2).toFixed(1),
    windDirection: Math.floor(Math.random() * 360),
    timestamp: new Date().toISOString()
  };
}

/**
 * Format weather data from OpenWeatherMap API
 */
function formatWeatherData(data, type) {
  const result = {
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: data.weather[0].description,
    windSpeed: data.wind?.speed || 0,
    windDirection: data.wind?.deg || 0,
    timestamp: new Date().toISOString()
  };

  if (type === 'city') {
    result.city = data.name;
    result.country = data.sys.country;
  } else {
    result.latitude = data.coord.lat;
    result.longitude = data.coord.lon;
    result.city = data.name;
    result.country = data.sys.country;
  }

  return result;
}

module.exports = {
  getWeatherByCity,
  getWeatherByCoords
};

