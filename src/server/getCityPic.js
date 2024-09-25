const axios = require("axios");

const getCityPic = async (city, key) => {
    try {
        const { data } = await axios.get(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(city)}&image_type=photo`);

        const image = data.hits.length > 0 
            ? data.hits[0].webformatURL 
            : "https://source.unsplash.com/random/640x480?city,morning,night?sig=1";

        return { image };
    } catch (error) {
        console.error('Error fetching city picture:', error.message);
        return { image: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1" }; // صورة افتراضية في حالة الخطأ
    }
};

module.exports = { getCityPic };
