const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { getCityLoc } = require("./getCityLoc");
const { getWeather } = require("./getWeather");
const { getCityPic } = require("./getCityPic");

dotenv.config();
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Get environment variables
const username = process.env.USERNAME;
const weatherKey = process.env.WEATHER_KEY;
const pixabayKey = process.env.PIXABAY_KEY;

// Check for required environment variables
function checkEnvVars() {
    const requiredVars = ['USERNAME', 'WEATHER_KEY', 'PIXABAY_KEY'];
    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            console.error(`${key} is missing in environment variables.`);
            process.exit(1);
        }
    });
}
checkEnvVars();

// Helper function for error handling
const handleError = (res, error, message) => {
    console.error(error);
    res.status(500).json({ success: false, error: message || error.message });
};

// API routes
app.post("/getCityLoc", async (req, res) => {
    try {
        const { city } = req.body;
        const location = await getCityLoc(city, username);
        res.status(200).json({ success: true, location });
    } catch (error) {
        handleError(res, error, "Error fetching city location");
    }
});

app.post("/getWeather", async (req, res) => {
    try {
        const { lng, lat, remainingDays } = req.body;
        const weatherData = await getWeather(lng, lat, remainingDays, weatherKey);
        res.status(200).json({ success: true, weatherData });
    } catch (error) {
        handleError(res, error, "Error fetching weather data");
    }
});

app.post("/getCityPic", async (req, res) => {
    try {
        const { city_name } = req.body;
        const picture = await getCityPic(city_name, pixabayKey);
        res.status(200).json({ success: true, picture });
    } catch (error) {
        handleError(res, error, "Error fetching city picture");
    }
});

// Function to calculate trip duration
const calculateTripDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

