// getCityPic.js
const axios = require('axios');

const getCityPic = async (city_name, pixabayKey) => {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${pixabayKey}&q=${city_name}&image_type=photo`);
    const picture = response.data.hits[0].webformatURL;
    return { image: picture };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching city picture');
  }
};

module.exports = { getCityPic };