# Weather API

A simple, fast, and reliable REST API for fetching current weather conditions by location. Built with Node.js and Express.

## Features

- 🌤️ Get current weather by city name
- 🌍 Get weather by coordinates (lat/lon)
- 📊 Returns temperature, humidity, pressure, and conditions
- ⚡ Fast response times
- 🔒 Simple and secure
- 📝 Well-documented API

## Installation

```bash
# Clone the repository
git clone https://github.com/Yardentamam/Weather_api.git
cd Weather_api

# Install dependencies
npm install

# Start the server
npm start
```

## Quick Start

1. **Get your API key** (optional - uses mock data if not provided):
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api) (free tier available)
   - Or use the built-in mock data for testing

2. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env and add your API key if you have one
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3000`

## API Endpoints

### Get Weather by City

```http
GET /api/weather?city=London
```

**Response:**
```json
{
  "city": "London",
  "country": "GB",
  "temperature": 15.5,
  "feelsLike": 14.2,
  "humidity": 65,
  "pressure": 1013,
  "description": "Partly cloudy",
  "windSpeed": 5.2,
  "windDirection": 180,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Weather by Coordinates

```http
GET /api/weather?lat=51.5074&lon=-0.1278
```

### Health Check

```http
GET /health
```

## Documentation

For complete documentation and examples, visit our [documentation site](https://splendorous-praline-8164aa.netlify.app).

## Usage Examples

See [EXAMPLES.md](./EXAMPLES.md) for detailed usage examples in JavaScript, Python, and more.

## Testing

```bash
npm test
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
WEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=development
```

**Note:** If `WEATHER_API_KEY` is not provided, the API will use mock data for demonstration purposes.

## Project Structure

```
weather-api/
├── server.js          # Main API server
├── weather.js          # Weather service logic
├── mcp-server.js       # MCP server helper (for Cursor IDE integration)
├── test.js            # Simple test script
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `404` - City not found
- `500` - Server error

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Made with ❤️ for developers who need a simple weather API**
