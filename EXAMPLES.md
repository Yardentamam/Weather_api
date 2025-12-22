# Weather API - Usage Examples

This document provides various examples of how to use the Weather API.

## JavaScript/Node.js Examples

### Basic Fetch Request

```javascript
async function getWeather(city) {
  try {
    const response = await fetch(`http://localhost:3000/api/weather?city=${city}`);
    const data = await response.json();
    console.log(`Temperature in ${data.city}: ${data.temperature}°C`);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

getWeather('London');
```

### Using Axios

```javascript
const axios = require('axios');

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await axios.get('http://localhost:3000/api/weather', {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getWeatherByCoords(40.7128, -74.0060);
```

## Python Examples

### Using requests library

```python
import requests

def get_weather(city):
    url = f"http://localhost:3000/api/weather?city={city}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Temperature in {data['city']}: {data['temperature']}°C")
        print(f"Conditions: {data['description']}")
        return data
    else:
        print(f"Error: {response.status_code}")
        return None

get_weather("Tokyo")
```

## cURL Examples

### Get weather for a city

```bash
curl "http://localhost:3000/api/weather?city=Paris"
```

### Get weather by coordinates

```bash
curl "http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278"
```

### Pretty print JSON response

```bash
curl "http://localhost:3000/api/weather?city=London" | python -m json.tool
```

## React Example

```jsx
import React, { useState, useEffect } from 'react';

function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/weather?city=${city}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        setLoading(false);
      });
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (!weather) return <div>Error loading weather</div>;

  return (
    <div>
      <h2>{weather.city}</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Conditions: {weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
    </div>
  );
}

export default WeatherWidget;
```

## Error Handling Example

```javascript
async function getWeatherSafely(city) {
  try {
    const response = await fetch(`http://localhost:3000/api/weather?city=${city}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch weather');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Usage
const result = await getWeatherSafely('InvalidCity');
if (result.success) {
  console.log('Weather:', result.data);
} else {
  console.error('Error:', result.error);
}
```

