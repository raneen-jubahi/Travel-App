const axios = require('axios');

const getCityLoc = async (city, username) => {
  try {
    // استدعاء API للحصول على الموقع الجغرافي للمدينة
    const response = await axios.get(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`);

    // التحقق من وجود نتائج
    if (response.data.geonames && response.data.geonames.length > 0) {
      const location = response.data.geonames[0];
      return {
        lng: location.lng,
        lat: location.lat,
        name: location.name,
      };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching city location');
  }
};

module.exports = { getCityLoc };
