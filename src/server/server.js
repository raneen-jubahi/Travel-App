// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3001;

// Import functions
const { getCityLoc } = require("./getCityLoc");
const { getWeather } = require("./getWeather");
const { getCityPic } = require("./getCityPic");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Get environment variables
const username = process.env.USERNAME;
const weatherKey = process.env.WEATHER_KEY;
const pixabayKey = process.env.PIXABAY_KEY;


if (!weatherKey || !pixabayKey) {
    console.error("API keys are missing in environment variables.");
    process.exit(1);
}

// API routes
app.post("/getCityLoc", async (req, res) => {
    try {
        const { city } = req.body;
        const location = await getCityLoc(city, username);
        res.send(location);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error fetching city location" });
    }
});

app.post("/getWeather", async (req, res) => {
    try {
        const { lng, lat, remainingDays } = req.body;
        const weatherData = await getWeather(lng, lat, remainingDays, weatherKey);
        res.send(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error fetching weather data" });
    }
});

app.post("/getCityPic", async (req, res) => {
    try {
        const { city_name } = req.body;
        const picture = await getCityPic(city_name, pixabayKey);
        res.send(picture);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error fetching city picture" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});