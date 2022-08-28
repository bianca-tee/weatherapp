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

let currentTime = new Date();
let dateTimeElement = document.querySelector("#current-date-time");
dateTimeElement.innerHTML = formatDate(currentTime);

function showTempCity(response) {
  document.querySelector(`#current-city`).innerHTML = response.data.name;
  document.querySelector(`#current-temp`).innerHTML = `${Math.round(
    response.data.main.temp
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
