require('dotenv').config(); // قم بتحميل المتغيرات البيئية
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getCityLoc } = require('./getCityLoc');
const { getweather } = require('./getweather');
const { getCityPic } = require('./getCityPic');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/getWeather', async (req, res) => {
    const { city, days } = req.body; // احصل على المدينة وعدد الأيام من الجسم
    const username = process.env.USERNAME; // استخدم اسم المستخدم من المتغيرات البيئية
    const weatherKey = process.env.WEATHER_KEY; // استخدم مفتاح الطقس من المتغيرات البيئية
    const imageKey = process.env.PIXABAY_KEY; // استخدم مفتاح Pixabay من المتغيرات البيئية

    try {
        const location = await getCityLoc(city, username);
        const weatherData = await getweather(location.lng, location.lat, days, weatherKey);
        const cityPic = await getCityPic(city, imageKey);
        
        res.json({ location, weatherData, cityPic });
    } catch (error) {
        console.error('Error in /api/getWeather:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
