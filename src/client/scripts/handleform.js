import axios from 'axios';
const Joi = require('joi');

// Fetch weather data from the API
export async function fetchWeatherData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}

// Helper functions
const getRemainingDays = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const timeDiff = targetDate - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const getCityLoc = async (city) => {
  try {
    const { data } = await axios.post('http://localhost:3001/getCityLoc', { city });
    return data;
  } catch (error) {
    console.error(`Error fetching city location: ${error.message}`);
    return { error: true, message: 'Failed to fetch city location' };
  }
};

const getCityPic = async (cityName) => {
  try {
    const { data } = await axios.post('http://localhost:3001/getCityPic', { city_name: cityName });
    return data.image;
  } catch (error) {
    console.error(`Error fetching city picture: ${error.message}`);
    return 'https://source.unsplash.com/random/640x480?city'; // Default image if fetch fails
  }
};

// Update UI with fetched data
const updateUI = (remainingDays, city, pic, weather) => {
  document.querySelector('#Rdays').innerHTML = `Your trip is in ${remainingDays} days`;
  document.querySelector('.cityName').innerHTML = `Location: ${city}`;
  document.querySelector('.weather').innerHTML = `Expected weather: ${weather.current.condition.text}`;
  document.querySelector('.temp').innerHTML = `Temperature: ${weather.current.temp_c} &deg;C`;
  document.querySelector('.cityPic').innerHTML = `<img src="${pic}" alt="City view">`;
  document.querySelector('.flight_data').style.display = 'block'; // Show flight data section
};

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const cityInput = document.querySelector('#city');
  const dateInput = document.querySelector('#flightDate');
  const cityError = document.querySelector('#city_error');
  const dateError = document.querySelector('#date_error');
  const spinner = document.getElementById('loading-spinner');
  const errorMessage = document.getElementById('error-message');

  // Reset errors
  if (cityError) cityError.style.display = 'none';
  if (dateError) dateError.style.display = 'none';
  if (errorMessage) errorMessage.textContent = ''; // Clear previous error messages

  // Validate inputs using a more robust validation library (e.g., Joi)
  const cityValidation = Joi.string().required().label('City');
  const dateValidation = Joi.date().required().label('Flight Date');

  try {
    await cityValidation.validateAsync(cityInput.value);
    await dateValidation.validateAsync(dateInput.value);
  } catch (error) {
    if (error.details[0].path[0] === 'city') {
      cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${error.details[0].message}`;
      cityError.style.display = 'block';
    } else {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${error.details[0].message}`;
      dateError.style.display = 'block';
    }
    return;
  }

  // Show spinner during data fetching
  if (spinner) spinner.style.display = 'block';

  try {
    const locationData = await getCityLoc(cityInput.value);
    if (locationData.error) {
      cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
      cityError.style.display = 'block';
      return;
    }

    const { lng, lat, name } = locationData;
    const date = dateInput.value;
    const remainingDays = getRemainingDays(date);

    // Fetch weather data with a valid API key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=f2f6b3ef801c439a9684e706de682f38&q=${cityInput.value}`;
    const weatherData = await fetchWeatherData(apiUrl);

    // Check weather data for errors
    if (weatherData.error) {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weatherData.message}`;
      dateError.style.display = 'block';
      return;
    }

    const picture = await getCityPic(name);
    updateUI(remainingDays, name, picture, weatherData);
  } catch (error) {
    console.error(`Error handling form submission: ${error.message}`);
    if (errorMessage) errorMessage.textContent = `An error occurred: ${error.message}`;
  } finally {
    if (spinner) spinner.style.display = 'none'; // Hide spinner after processing
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit);
});

export { handleSubmit };