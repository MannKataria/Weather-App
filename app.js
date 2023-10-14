// Selecting elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const minTempElement = document.querySelector(".minTemp p");
const maxTempElement = document.querySelector(".maxTemp p");
const humidityElement = document.querySelector(".humidity p");
const pressureElement = document.querySelector(".pressure p");
const windSpeedElement = document.querySelector(".windSpeed p");

// Storing weather data
const weather = {};
weather.temperature = {
  unit: "celsius",
};

// Constants and API Key
const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0";

// Setting User Position
const setPosition = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  getWeather(latitude, longitude);
};

// Showing Error
const showError = (error) => {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
};

// Checking if user browser supports Geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// Function to display Weather
const displayWeather = () => {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;

  minTempElement.innerHTML = `L: ${weather.temperature.min}°<span>C</span>`;
  maxTempElement.innerHTML = `H: ${weather.temperature.max}°<span>C</span>`;
  humidityElement.innerHTML = `${weather.humidity} <span>%</span>`;
  pressureElement.innerHTML = `${weather.pressure} <span>kPa</span>`;
  windSpeedElement.innerHTML = `${weather.windspeed} <span>m/s</span>`;
};

// Getting weather details from API
const getWeather = (latitude, longitude) => {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.temperature.max = Math.floor(data.main.temp_max - KELVIN);
      weather.temperature.min = Math.floor(data.main.temp_min - KELVIN);
      weather.humidity = data.main.humidity;
      weather.pressure = data.main.pressure / 10;
      weather.windspeed = data.wind.speed;
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(displayWeather);
};

// C to F conversion
const celsiusToFahrenheit = (temperature) => {
  return (temperature * 9) / 5 + 32;
};

// Change from C to F OR F to C
tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit == "celsius") {
    const fahrenheit = Math.floor(
      celsiusToFahrenheit(weather.temperature.value)
    );
    const minf = Math.floor(
      celsiusToFahrenheit(weather.temperature.min)
    ); 
    const maxf = Math.floor(
      celsiusToFahrenheit(weather.temperature.max)
    ); 
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    minTempElement.innerHTML = `L: ${minf}°<span>F</span>`;
    maxTempElement.innerHTML = `H: ${maxf}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    minTempElement.innerHTML = `L: ${weather.temperature.min}°<span>C</span>`;
    maxTempElement.innerHTML = `H: - ${weather.temperature.max}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
