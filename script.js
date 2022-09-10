function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  return `${currentDay} ${hours}:${minutes}`;
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col">
          <div class="weather-icon"><i class="fa-solid fa-cloud-sun"></i></div>
          <p>${day}</p>
          <span class="future-temp">16°</span>
        </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let currentTime = new Date();
let dateTimeElement = document.querySelector("#current-date-time");
dateTimeElement.innerHTML = formatDate(currentTime);

function showTempCity(response) {
  celsiusTemperature = response.data.main.temp;
  document.querySelector(`#current-city`).innerHTML = response.data.name;
  document.querySelector(`#current-temp`).innerHTML = `${Math.round(
    celsiusTemperature
  )}°`;
  document.querySelector(`#min-temp`).innerHTML = `${Math.round(
    response.data.main.temp_min
  )}°`;
  document.querySelector(`#max-temp`).innerHTML = `${Math.round(
    response.data.main.temp_max
  )}°`;
  document.querySelector(`#weather-overall`).innerHTML =
    response.data.weather[0].main;
  document.querySelector(`#wind`).innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(`#humidity`).innerHTML = response.data.main.humidity;
  document
    .querySelector(`#icon`)
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let apiKey = "0fbc2c49d4b2c78e5faff6668811ca96";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTempCity);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

function getCity(response) {
  let cityHere = response.data.locality;
  let cityHeading = document.querySelector("#current-city");
  cityHeading.innerHTML = cityHere;
}

function weatherHere(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "0fbc2c49d4b2c78e5faff6668811ca96";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=en&units=metric`;
  axios.get(weatherUrl).then(showTempCity);
  let cityUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  axios.get(cityUrl).then(getCity);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(weatherHere);
}

let locationPin = document.querySelector(`#location-pin`);
locationPin.addEventListener("click", currentLocation);

function convertFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = `${Math.round(fahrenheitTemp)}°`;
}

function convertCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
}

let celsiusTemperature = null;

document
  .querySelector(`#fahrenheit`)
  .addEventListener("click", convertFahrenheit);

document.querySelector("#celsius").addEventListener("click", convertCelsius);

displayForecast();
