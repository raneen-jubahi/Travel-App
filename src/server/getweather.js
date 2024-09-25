const axios = require("axios");

const getweather = async (lo, la, Rdays, key) => {
    if (Rdays < 0) {
        return {
            message: "Date cannot be in the past",
            error: true
        };
    }

    try {
        let weather_data;

        if (Rdays > 0 && Rdays <= 7) {
            const { data } = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${la}&lon=${lo}&units=M&key=${key}`);
            const { weather, temp } = data.data[0]; // استخدم أول عنصر مباشرةً
            const { description } = weather;
            weather_data = { description, temp };
        } else if (Rdays > 7) {
            const { data } = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${la}&lon=${lo}&units=M&days=${Rdays}&key=${key}`);
            const { weather, temp, app_max_temp, app_min_temp } = data.data[0]; // استخدم أول عنصر مباشرةً
            const { description } = weather;
            weather_data = { description, temp, app_max_temp, app_min_temp };
        }

        return weather_data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error; // إعادة الخطأ ليتعامل معه المستدعي
    }
};

module.exports = { getweather };
