const axios = require("axios");

const getCityLoc = async (city, username) => {
    try {
        const { data } = await axios.get(`https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`);
        
        // تحقق من وجود بيانات المدينة
        if (data.geonames.length === 0) {
            throw new Error('City not found');
        }

        const { name, lat, lng } = data.geonames[0];
        return { name, lat, lng };
    } catch (error) {
        console.error('Error fetching city location:', error.message);
        throw error; // إعادة الخطأ ليتعامل معه المستدعي
    }
};

module.exports = { getCityLoc };
