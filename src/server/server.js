const express = require("express");
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const cors = require("cors");
const dotenv = require("dotenv");

const port = 3001;

// استيراد الدوال من الملفات الأخرى
const { getCityLoc } = require("./getCityLoc");
const { getWeather } = require("./getweather");
const { getCityPic } = require("./getCityPic");

// إعدادات favicon (إذا لزم الأمر)
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// نقطة البداية
app.get("/", (req, res) => {
    res.render("index.html");
});

// قراءة بيانات JSON
app.use(express.json());
app.use(express.static('dist'));
dotenv.config();

// الحصول على معلومات المستخدم من المتغيرات البيئية
const username = `${process.env.USERNAME}${process.env.USERNUMBER}`;
const weatherKey = process.env.WEATHER_KEY;
const pixabayKey = process.env.pixabay_key;

if (!weatherKey || !pixabayKey) {
    console.error("مفاتيح API غير معرفة في المتغيرات البيئية.");
    process.exit(1);
}

// استخدام CORS
app.use(cors());

// دالة للحصول على الموقع من GeoNames
app.post("/getCityLoc", async (req, res) => {
    try {
        const { city } = req.body;
        const location = await getCityLoc(city, username);
        res.send(location);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'حدث خطأ أثناء الحصول على موقع المدينة' });
    }
});

// دالة للحصول على بيانات الطقس
app.post("/getWeather", async (req, res) => {
    try {
        const { lng, lat, remainingDays } = req.body;
        const weatherData = await getWeather(lng, lat, remainingDays, weatherKey);
        res.send(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'حدث خطأ أثناء الحصول على بيانات الطقس' });
    }
});

// دالة للحصول على صورة المدينة
app.post("/getCityPic", async (req, res) => {
    try {
        const { city_name } = req.body;
        const picture = await getCityPic(city_name, pixabayKey);
        res.send(picture);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'حدث خطأ أثناء الحصول على صورة المدينة' });
    }
});

// تشغيل السيرفر
app.listen(port, () => console.log(`السيرفر يستمع على المنفذ ${port}`));
