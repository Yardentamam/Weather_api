/**
 * Weather API Server
 * Simple REST API for fetching weather data
 */

const express = require('express');
const weatherService = require('./weather');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (allow all origins for simplicity)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Weather API v1.2.3',
    endpoints: {
      weather: '/api/weather?city=London',
      weatherByCoords: '/api/weather?lat=51.5074&lon=-0.1278',
      health: '/health'
    },
    documentation: 'https://github.com/yourusername/weather-api'
  });
});

// Main weather endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    // Validate input
    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        error: 'Please provide either a city name or coordinates (lat & lon)',
        code: 400
      });
    }

    let weatherData;

    if (city) {
      // Get weather by city name
      weatherData = await weatherService.getWeatherByCity(city);
    } else {
      // Get weather by coordinates
      weatherData = await weatherService.getWeatherByCoords(
        parseFloat(lat),
        parseFloat(lon)
      );
    }

    if (!weatherData) {
      return res.status(404).json({
        error: 'Weather data not found',
        code: 404
      });
    }

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 500,
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 404
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌤️  Weather API server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

