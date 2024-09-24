const express = require("express")
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port =3000;

//get the city function which get location from geoNames
const  {getCityLoc} = require("./getCityLoc")
const {getweather} = require("./getweather")
const {getCityPic} = require("./getCityPic")


app.get("/", (req, res) => {
    res.render("index.html")
  })


//read the json files coming to you
app.use(express.json())
app.use(express.static('dist'))
dotenv.config()


const userstring = process.env.USERNAME
const usernumber = process.env.USERNUMBER
const username = userstring.concat(usernumber)
const  weather_key = process.env.WEATHER_KEY
const pixabay_key = process.env.pixabay_key




//using cors
app.use(cors())

  app.post("/getCityLoc", async (req,res) => {
    console.log(req.body)
const{city }=req.body;
const Location= await getCityLoc(city, username)
res.send(Location)
})



app.post("/getWeather", async (req,res) => {
  const {lng, lat, remainingDays} = req.body
  const getWeather = await getweather(lng, lat, remainingDays, weather_key)
  return res.send(getWeather)
})

app.post("/getCityPic", async (req,res) => {
  const {city_name} = req.body
  const getPic = await getCityPic(city_name, pixabay_key)
  return res.send(getPic)
})


app.listen(3000, () => console.log(`server is listening on port ${port}`))