import axios from "axios";

// وضع الكود داخل حدث DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // اختيار العناصر من DOM
    const form = document.querySelector("form");
    const cityInput = document.querySelector("#city");
    const dateInput = document.querySelector("#flightDate");

    const cityError = document.querySelector("#city_error");
    const dateError = document.querySelector("#date_error");

    // إضافة حدث الإرسال إلى النموذج
    form.addEventListener("submit", handleSubmit);
});

// دالة التعامل مع الإرسال
const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق من صحة المدخلات
    if (!validateInputs()) {
        return;
    }

    try {
        // الحصول على الموقع أولاً
        const locationData = await getCityLoc();
        if (locationData && locationData.error) {
            cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
            cityError.style.display = "block";
            return;
        }

        const { lng, lat, name } = locationData;
        const date = dateInput.value;

        // تحقق من إدخال التاريخ
        if (!date) {
            dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>يرجى إدخال التاريخ`;
            dateError.style.display = "block";
            return;
        }

        if (lng && lat) {
            const remainingDays = getRemainingDays(date);
            const weatherData = await getWeather(lng, lat, remainingDays);
            if (weatherData && weatherData.error) {
                dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weatherData.message}`;
                dateError.style.display = "block";
                return;
            }
            const picture = await getCityPic(name);
            updateUI(remainingDays, name, picture, weatherData);
        }
    } catch (error) {
        console.error("خطأ أثناء معالجة البيانات:", error);
    }
};

// دالة للتحقق من المدخلات
const validateInputs = () => {
    const cityError = document.querySelector("#city_error");
    const dateError = document.querySelector("#date_error");
    cityError.style.display = "none";
    dateError.style.display = "none";

    if (!cityInput.value) {
        cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>يجب إدخال اسم المدينة`;
        cityError.style.display = "block";
        return false;
    }

    if (!dateInput.value) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>يرجى إدخال التاريخ`;
        dateError.style.display = "block";
        return false;
    }

    if (getRemainingDays(dateInput.value) < 0) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>لا يمكن أن يكون التاريخ في الماضي`;
        dateError.style.display = "block";
        return false;
    }

    return true;
};

// دالة للحصول على الموقع
const getCityLoc = async () => {
    try {
        if (cityInput.value) {
            const { data } = await axios.post("http://localhost:3001/getCityLoc", { city: cityInput.value }, {
                headers: { "Content-Type": "application/json" },
            });
            return data;
        } else {
            cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>لا يمكن ترك هذا الحقل فارغًا`;
            cityError.style.display = "block";
        }
    } catch (error) {
        console.error("خطأ أثناء الحصول على موقع المدينة:", error);
        cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>حدث خطأ أثناء الحصول على موقع المدينة`;
        cityError.style.display = "block";
    }
};

// دالة للحصول على بيانات الطقس
const getWeather = async (lng, lat, remainingDays) => {
    try {
        const { data } = await axios.post("http://localhost:3001/getWeather", { lng, lat, remainingDays });
        return data;
    } catch (error) {
        console.error("خطأ أثناء الحصول على بيانات الطقس:", error);
    }
};

// دالة لحساب الأيام المتبقية
const getRemainingDays = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = targetDate - today;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// دالة للحصول على صورة المدينة
const getCityPic = async (cityName) => {
    try {
        const { data } = await axios.post("http://localhost:3001/getCityPic", { city_name: cityName });
        return data.image;
    } catch (error) {
        console.error("خطأ أثناء الحصول على صورة المدينة:", error);
    }
};

// دالة لتحديث واجهة المستخدم
const updateUI = (remainingDays, city, pic, weather) => {
    document.querySelector("#Rdays").innerHTML = `ستبدأ رحلتك بعد ${remainingDays} يومًا`;
    document.querySelector(".cityName").innerHTML = `الموقع: ${city}`;
    document.querySelector(".weather").innerHTML =
        remainingDays > 7 ? `الطقس هو: ${weather.description}` : `من المتوقع أن يكون الطقس: ${weather.description}`;
    document.querySelector(".temp").innerHTML =
        remainingDays > 7 ? `التوقع: ${weather.temp}&degC` : `درجة الحرارة: ${weather.temp} &degC`;
    document.querySelector(".max-temp").innerHTML =
        remainingDays > 7 ? `الحد الأقصى: ${weather.app_max_temp}&degC` : "";
    document.querySelector(".min-temp").innerHTML =
        remainingDays > 7 ? `الحد الأدنى: ${weather.app_min_temp}&degC` : "";
    document.querySelector(".cityPic").innerHTML = `
        <img 
            src="${pic}" 
            alt="صورة توضح طبيعة المدينة"
        >
    `;
    document.querySelector(".flight_data").style.display = "block";
};

// تصدير الدالة
export { handleSubmit };
