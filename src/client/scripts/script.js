// استيراد Joi
const Joi = require('joi');

// التعامل مع نموذج الرحلة
document.getElementById("searchForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const city = document.getElementById("destination").value;
  const date = document.getElementById("end-date").value; // Use end-date instead of flightDate
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
    // التحقق من الحقل الذي يحتوي على الخطأ وعرض رسالة مناسبة
    if (error.details[0].path[0] === 'city') {
      cityError.textContent = error.details[0].message;
      cityError.classList.remove("d-none");
    }
    if (error.details[0].path[0] === 'date') {
      dateError.textContent = error.details[0].message;
      dateError.classList.remove("d-none");
    }
    return; // وقف المعالجة عند وجود خطأ
  }

  // استدعاء دالة جلب بيانات الطقس وعرض البيانات
  const weatherData = await getWeatherData(city);
  displayTripDetails(city, date, weatherData);
});

// Add functionality for adding more destinations dynamically
document.getElementById("add-destination").addEventListener("click", function() {
  const additionalDestinationInput = document.createElement("input");
  additionalDestinationInput.type = "text";
  additionalDestinationInput.className = "form-control mb-2";
  additionalDestinationInput.placeholder = "Enter another destination";
  document.getElementById("destinations").appendChild(additionalDestinationInput);
});

// دالة جلب بيانات الطقس
async function getWeatherData(city) {
  const apiKey = f2f6b3ef801c439a9684e706de682f38; 

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    
    if (!response.ok) {
      throw new Error("فشل في جلب بيانات الطقس");
    }

    const data = await response.json();

    // التحقق من صحة البيانات المرسلة من API
    if (!data || !data.current) {
      throw new Error("البيانات غير متوفرة");
    }

    return {
      temp: data.current.temp_c,
      weatherDescription: data.current.condition.text,
      cityPic: data.current.condition.icon,
    };
  } catch (error) {
    console.error(error);
    // عرض بيانات افتراضية عند فشل جلب البيانات
    return {
      temp: "N/A",
      weatherDescription: "N/A",
      cityPic: "https://via.placeholder.com/150",
    };
  }
}

// دالة عرض بيانات الرحلة
function displayTripDetails(city, date, weatherData) {
  document.getElementById("tripSummary").innerHTML = `
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
  const zipError = document.getElementById("zip_error");

  zipError.classList.add("d-none"); // إخفاء خطأ الرمز البريدي في البداية
  spinner.style.display = "block"; // إظهار مؤشر التحميل

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    
    if (!response.ok) {
      throw new Error("فشل في جلب البيانات");
    }

    const data = await response.json();
    // شفرة هنا لتعامل مع البيانات
  } catch (error) {
    console.error(error);
    zipError.textContent = "حدث خطأ في إدخال الرمز البريدي";
    zipError.classList.remove("d-none");
  } finally {
    spinner.style.display = "none"; // إخفاء مؤشر التحميل
  }
}

// Clear Trip Functionality
document.getElementById("clearTrip").addEventListener("click", function() {
  document.getElementById("tripSummary").innerHTML = ""; // Clear trip summary
  document.getElementById("destination").value = ""; // Clear destination input
  document.getElementById("end-date").value = ""; // Clear end date input
  document.getElementById("zipCode").value = ""; // Clear zip code input
  document.getElementById("loading-spinner").style.display = "none"; // Hide loading spinner
});

// Print Functionality
document.getElementById("printTrip").addEventListener("click", function() {
  window.print(); // Simple print functionality
});


async function fetchImage(country) {
  const pixabayApiKey = 'YOUR_PIXABAY_API_KEY';
  const response = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=${country}&image_type=photo`);
  const data = await response.json();
  
  if (data.hits.length > 0) {
      return data.hits[0].webformatURL;
  } else {
      return 'default-image-url.jpg'; // صورة افتراضية في حالة عدم وجود نتائج
  }
}

async function updateUI(country) {
  const imageUrl = await fetchImage(country);
  document.getElementById("country-image").src = imageUrl;
}
