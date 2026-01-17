// Weather service for fetching live weather data
import OfflineService from './offlineService';

// Using OpenWeatherMap API (free tier)
// You can also use: WeatherAPI, Tomorrow.io, or Visual Crossing
const WEATHER_API_KEY = 'your_api_key_here'; // Replace with actual API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  cloudiness: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  location: string;
  timestamp: number;
}

class WeatherService {
  private static instance: WeatherService;

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Fetch weather data by coordinates (latitude, longitude)
   */
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
    const cacheKey = `weather_${lat}_${lon}`;
    
    return await OfflineService.fetchWithCache(
      cacheKey,
      async () => {
        try {
          const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
          }
          
          const data = await response.json();
          return this.parseWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          throw error;
        }
      }
    );
  }

  /**
   * Fetch weather data by city name
   */
  async getWeatherByCity(city: string, country?: string): Promise<WeatherData | null> {
    const query = country ? `${city},${country}` : city;
    const cacheKey = `weather_${query.toLowerCase().replace(/\s/g, '_')}`;
    
    return await OfflineService.fetchWithCache(
      cacheKey,
      async () => {
        try {
          const url = `${WEATHER_API_URL}?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}&units=metric`;
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
          }
          
          const data = await response.json();
          return this.parseWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          throw error;
        }
      }
    );
  }

  /**
   * Parse OpenWeatherMap API response
   */
  private parseWeatherData(data: any): WeatherData {
    return {
      temperature: Math.round(data.main.temp * 10) / 10,
      feelsLike: Math.round(data.main.feels_like * 10) / 10,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      windDirection: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      cloudiness: data.clouds.all,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      location: data.name,
      timestamp: Date.now(),
    };
  }

  /**
   * Get mock weather data for demo/offline mode
   */
  getMockWeatherData(location: string = 'Demo Location'): WeatherData {
    return {
      temperature: Math.round((Math.random() * 10 + 20) * 10) / 10,
      feelsLike: Math.round((Math.random() * 10 + 20) * 10) / 10,
      humidity: Math.floor(Math.random() * 20 + 60),
      pressure: Math.floor(Math.random() * 20 + 1000),
      windSpeed: Math.round((Math.random() * 5 + 2) * 10) / 10,
      windDirection: Math.floor(Math.random() * 360),
      description: 'partly cloudy',
      icon: '02d',
      cloudiness: Math.floor(Math.random() * 40 + 20),
      visibility: Math.round((Math.random() * 5 + 5) * 10) / 10,
      sunrise: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      sunset: Date.now() + 6 * 60 * 60 * 1000, // 6 hours from now
      location,
      timestamp: Date.now(),
    };
  }

  /**
   * Convert wind direction in degrees to compass direction
   */
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  /**
   * Format sunrise/sunset time
   */
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Get weather icon URL from OpenWeatherMap
   */
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  /**
   * Determine if weather is suitable for poultry
   */
  isWeatherSuitable(weather: WeatherData): {
    suitable: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    
    // Temperature checks
    if (weather.temperature < 18) {
      warnings.push('Temperature is below optimal range (18-28°C)');
    } else if (weather.temperature > 28) {
      warnings.push('Temperature is above optimal range (18-28°C)');
    }
    
    // Humidity checks
    if (weather.humidity < 50) {
      warnings.push('Low humidity may affect bird health');
    } else if (weather.humidity > 80) {
      warnings.push('High humidity increases disease risk');
    }
    
    // Wind speed checks
    if (weather.windSpeed > 15) {
      warnings.push('High wind speed may require additional ventilation control');
    }
    
    return {
      suitable: warnings.length === 0,
      warnings,
    };
  }
}

export default WeatherService.getInstance();
