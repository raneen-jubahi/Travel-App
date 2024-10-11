// getWeather.js
const axios = require('axios');

const getWeather = async (lng, lat, remainingDays, weatherKey) => {
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${lat},${lng}`);
    const weatherData = response.data;
    return weatherData;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching weather data');
  }
};

module.exports = { getWeather };