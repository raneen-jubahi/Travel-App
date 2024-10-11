const axios = require('axios');

const getCityPic = async (city_name, pixabayKey) => {
  try {
    // طلب الصورة من Pixabay
    const response = await axios.get(`https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(city_name)}&image_type=photo`);

    // التحقق من وجود نتائج
    if (response.data.hits.length > 0) {
      const picture = response.data.hits[0].webformatURL;
      return { image: picture };
    } else {
      // إرجاع صورة افتراضية في حال عدم العثور على نتائج
      return { image: 'https://source.unsplash.com/random/640x480?city' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching city picture');
  }
};

module.exports = { getCityPic };
