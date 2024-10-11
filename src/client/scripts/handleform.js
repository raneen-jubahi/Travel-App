import axios from 'axios';
import Joi from 'joi';

// Schema for validation
const schema = Joi.object({
    city: Joi.string().required().label('City'),
    date: Joi.date().greater('now').required().label('Flight Date') // Ensure date is in the future
});

// Fetch weather data from the API
export async function fetchWeatherData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'Error fetching weather data');
        }
        return data;
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
        return data.image || 'https://source.unsplash.com/random/640x480?city'; // Default image if fetch fails
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
async function handleSubmit(event) {
    event.preventDefault();

    const cityInput = document.querySelector('#city');
    const dateInput = document.querySelector('#flightDate');
    const cityError = document.querySelector('#city_error');
    const dateError = document.querySelector('#date_error');
    const spinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');

    // Reset previous errors
    cityError.style.display = 'none';
    dateError.style.display = 'none';
    errorMessage.textContent = '';

    // Validate inputs
    try {
        await schema.validateAsync({ city: cityInput.value, date: dateInput.value });
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

    // Show loading spinner
    spinner.style.display = 'block';

    try {
        const locationData = await getCityLoc(cityInput.value);
        if (locationData.error) {
            cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
            cityError.style.display = 'block';
            return;
        }

        const { name } = locationData;
        const remainingDays = getRemainingDays(dateInput.value);

        // Fetch weather data
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${cityInput.value}`; // Use environment variable
        const weatherData = await fetchWeatherData(apiUrl);
        
        const picture = await getCityPic(name);
        updateUI(remainingDays, name, picture, weatherData);
    } catch (error) {
        errorMessage.textContent = `An error occurred: ${error.message}`;
    } finally {
        spinner.style.display = 'none'; // Hide spinner
    }
}

// Document ready handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
});

export { handleSubmit };
