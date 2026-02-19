/**
 * Weather Service using Open-Meteo API (free, no API key required)
 * Uses geolocation or defaults to Dhaka, Bangladesh
 */

const DEFAULT_LAT = 23.8103; // Dhaka, Bangladesh
const DEFAULT_LON = 90.4125;

/**
 * Get current weather data from Open-Meteo API
 * @param {number} lat - Latitude (defaults to Dhaka)
 * @param {number} lon - Longitude (defaults to Dhaka)
 * @returns {Promise<{temp: number, weatherCode: number, description: string, icon: string}>}
 */
export async function getCurrentWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`;
    const response = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const { description, icon } = getWeatherInfo(weatherCode);

    return { temp, weatherCode, description, icon };
  } catch (error) {
    console.error('Weather service error:', error);
    return { temp: null, weatherCode: null, description: 'N/A', icon: 'cloudy' };
  }
}

/**
 * Map WMO weather code to description and icon type
 */
export function getWeatherInfo(code) {
  if (code === 0) return { description: 'Clear sky', icon: 'sunny' };
  if (code <= 2) return { description: 'Partly cloudy', icon: 'partly-cloudy' };
  if (code === 3) return { description: 'Overcast', icon: 'cloudy' };
  if (code <= 49) return { description: 'Foggy', icon: 'foggy' };
  if (code <= 59) return { description: 'Drizzle', icon: 'rainy' };
  if (code <= 69) return { description: 'Rain', icon: 'rainy' };
  if (code <= 79) return { description: 'Snow', icon: 'snowy' };
  if (code <= 82) return { description: 'Rain showers', icon: 'rainy' };
  if (code <= 86) return { description: 'Snow showers', icon: 'snowy' };
  if (code <= 99) return { description: 'Thunderstorm', icon: 'thunderstorm' };
  return { description: 'Unknown', icon: 'cloudy' };
}
