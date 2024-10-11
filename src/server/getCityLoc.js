// getCityLoc.js
const axios = require('axios');

const getCityLoc = async (city, username) => {
  try {
    const response = await axios.get(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`);
    const location = response.data.geonames[0];
    return {
      lng: location.lng,
      lat: location.lat,
      name: location.name,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching city location');
  }
};

module.exports = { getCityLoc };