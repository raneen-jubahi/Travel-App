const axios = require("axios");

const getCityLoc = async(city, username) => {
    const { data } = await axios.get(`https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=samar13`);
const{name , lat , lng} =await data.geonames[0]
console.log({name , lat , lng});

return { name , lat , lng}
}
module.exports =  {getCityLoc}