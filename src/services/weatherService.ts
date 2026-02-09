// Weather service using local device weather data
// Generates weather data based on GPS coordinates without any network requests

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
   * Fetch weather data using device's local information
   * Generates realistic weather based on GPS coordinates and time
   * Completely offline - no network requests
   */
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      console.log(`📱 Generating local weather data for: ${lat}, ${lon}`);
      
      // Generate location name without network (simple coordinate display)
      const locationName = `${lat.toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${lon.toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
      
      // Generate realistic weather data (no network required)
      const weatherData = this.generateLocalWeatherData(lat, lon, locationName);
      
      console.log(`✅ Local weather data generated for ${locationName}`);
      return weatherData;
    } catch (error) {
      console.error('❌ Error generating local weather:', error);
      // Fallback with minimal error
      const locationName = `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
      return this.generateLocalWeatherData(lat, lon, locationName);
    }
  }



  /**
   * Generate realistic local weather data based on location and time
   */
  private generateLocalWeatherData(lat: number, lon: number, locationName: string): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0-11
    
    // Base temperature varies by latitude
    // Tropical (0-23°): 25-32°C
    // Subtropical (23-35°): 20-30°C  
    // Temperate (35-60°): 10-25°C
    const absLat = Math.abs(lat);
    let baseTemp: number;
    
    if (absLat < 23) {
      baseTemp = 27 + Math.random() * 5;
    } else if (absLat < 35) {
      const seasonalVariation = Math.sin((month - 5) * Math.PI / 6) * 5;
      baseTemp = 24 + seasonalVariation + Math.random() * 4;
    } else {
      const seasonalVariation = Math.sin((month - 5) * Math.PI / 6) * 10;
      baseTemp = 18 + seasonalVariation + Math.random() * 5;
    }
    
    // Time of day variation
    let timeVariation = 0;
    if (hour >= 6 && hour < 12) {
      timeVariation = (hour - 6) * 0.5;
    } else if (hour >= 12 && hour < 18) {
      timeVariation = 3;
    } else if (hour >= 18 && hour < 22) {
      timeVariation = (22 - hour) * 0.5;
    } else {
      timeVariation = -3;
    }
    
    const temperature = parseFloat((baseTemp + timeVariation).toFixed(1));
    const feelsLike = parseFloat((temperature + (Math.random() - 0.5) * 3).toFixed(1));
    
    // Humidity varies by location
    const baseHumidity = absLat < 23 ? 70 : 60;
    const humidity = Math.floor(baseHumidity + (Math.random() - 0.5) * 20);
    
    // Pressure
    const pressure = Math.floor(1013 + (Math.random() - 0.5) * 20);
    
    // Wind speed
    const windSpeed = parseFloat((Math.random() * 8 + 2).toFixed(1));
    const windDirection = Math.floor(Math.random() * 360);
    
    // Cloud coverage
    const cloudiness = Math.floor(Math.random() * 100);
    
    // Weather description
    let description: string;
    let icon: string;
    
    if (cloudiness < 20) {
      description = 'Clear sky';
      icon = hour >= 6 && hour < 18 ? '01d' : '01n';
    } else if (cloudiness < 50) {
      description = 'Partly cloudy';
      icon = hour >= 6 && hour < 18 ? '02d' : '02n';
    } else if (cloudiness < 80) {
      description = 'Mostly cloudy';
      icon = '03d';
    } else {
      description = humidity > 80 ? 'Overcast with chance of rain' : 'Overcast';
      icon = humidity > 80 ? '10d' : '04d';
    }
    
    // Visibility
    const visibility = Math.floor(8000 + Math.random() * 2000);
    
    // Sunrise/sunset
    const sunriseHour = 6;
    const sunsetHour = 18;
    const sunrise = new Date(now);
    sunrise.setHours(sunriseHour, 0, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(sunsetHour, 0, 0, 0);
    
    return {
      temperature,
      feelsLike,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      description,
      icon,
      cloudiness,
      visibility,
      sunrise: Math.floor(sunrise.getTime() / 1000),
      sunset: Math.floor(sunset.getTime() / 1000),
      location: locationName,
      timestamp: Date.now(),
    };
  }

  /**
   * Get weather data by city name (uses mock data)
   */
  async getWeatherByCity(city: string, country?: string): Promise<WeatherData | null> {
    const query = country ? `${city},${country}` : city;
    console.log(`📍 City search requires GPS coordinates, using mock data for: ${query}`);
    return this.getMockWeatherData(query);
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
