const axios = require('axios');

const getWeather = async (lng, lat, remainingDays, weatherKey) => {
  try {
    // استدعاء API للحصول على بيانات الطقس
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${lat},${lng}`);

    // التحقق من وجود البيانات
    if (response.data && response.data.current) {
      const weatherData = {
        temperature: response.data.current.temp_c, // درجة الحرارة بالدرجة المئوية
        condition: response.data.current.condition.text, // وصف حالة الطقس
        icon: response.data.current.condition.icon, // أيقونة الطقس
        wind_kph: response.data.current.wind_kph, // سرعة الرياح بالكيلومتر/ساعة
        humidity: response.data.current.humidity // الرطوبة
      };
      return weatherData; // إرجاع البيانات المهمة فقط
    } else {
      throw new Error('Invalid weather data');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching weather data');
  }
};

module.exports = { getWeather };
