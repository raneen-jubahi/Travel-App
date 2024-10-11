// استيراد Joi
const Joi = require('joi');

// التعامل مع نموذج الرحلة
document.getElementById("tripForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  const city = document.getElementById("city").value;
  const date = document.getElementById("flightDate").value;
  const cityError = document.getElementById("city_error");
  const dateError = document.getElementById("date_error");

  cityError.classList.add("d-none"); // إخفاء خطأ المدينة في البداية
  dateError.classList.add("d-none"); // إخفاء خطأ التاريخ في البداية

  // تحقق من صحة البيانات باستخدام Joi
  const schema = Joi.object({
    city: Joi.string().required().label('City'),
    date: Joi.date().required().label('Date'),
  });

  const { error } = schema.validate({ city, date });

  if (error) {
    if (error.details[0].path[0] === 'city') {
      cityError.textContent = error.details[0].message;
      cityError.classList.remove("d-none");
    }
    if (error.details[0].path[0] === 'date') {
      dateError.textContent = error.details[0].message;
      dateError.classList.remove("d-none");
    }
    return;
  }

  const weatherData = await getWeatherData(city);
  displayTripDetails(city, date, weatherData);
});

async function getWeatherData(city) {
  // نموذج استدعاء API لاسترداد بيانات الطقس
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city}`);
    if (!response.ok) throw new Error("فشل في جلب بيانات الطقس");
    const data = await response.json();

    return {
      temp: data.current.temp_c,
      weatherDescription: data.current.condition.text,
      cityPic: data.current.condition.icon
    };
  } catch (error) {
    console.error(error);
    return {
      temp: "N/A",
      weatherDescription: "N/A",
      cityPic: "https://via.placeholder.com/150"
    };
  }
}

function displayTripDetails(city, date, weatherData) {
  document.getElementById("tripDetails").innerHTML = `
    <h3>ملخص رحلتك</h3>
    <p>الوجهة: ${city}</p>
    <p>التاريخ: ${date}</p>
    <p>درجة الحرارة: ${weatherData.temp} °C</p>
    <p>الطقس: ${weatherData.weatherDescription}</p>
    <img src="${weatherData.cityPic}" alt="صورة المدينة" class="img-fluid" />
  `;
  
  // إضافة معلومات المدينة للعناصر الجديدة
  document.querySelector('.cityName').textContent = city;
  document.querySelector('.weather').textContent = weatherData.weatherDescription;
  document.querySelector('.temp').textContent = `${weatherData.temp} °C`;
  document.querySelector('.cityPic').src = weatherData.cityPic;
}

// التعامل مع نموذج الرمز البريدي
async function handleZipSubmit() {
  const zipCode = document.getElementById("zipCode").value;
  const spinner = document.getElementById("loading-spinner");
  const errorMessage = document.getElementById("error-message");
  const zipError = document.getElementById("zip_error");

  zipError.classList.add("d-none"); // إخفاء خطأ الرمز البريدي في البداية
  spinner.style.display = "block";
  
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!response.ok) {
      throw new Error("فشل في جلب البيانات");
    }
    const data = await response.json();
    // شفرة هنا لتعامل مع البيانات
  } catch (error) {
    console.error(error);
    // شفرة هنا لتعامل مع الخطأ
  } finally {
    spinner.style.display = "none";
  }
}