//Determining the current time and date

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
  return `Last updated at ${currentDay} ${hours}:${minutes}`;
}

let currentTime = new Date();
let dateTimeElement = document.querySelector("#current-date-time");
dateTimeElement.innerHTML = formatDate(currentTime);

//Displays the forecast with the coord data from below
function displayForecast(response) {
  console.log(response.data.daily);
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

//Function that uses coords in an apiURL that allows us to get forecast, then runs fn displayForecast
function getForecast(coordinates) {
  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//Uses the lat and long to show the temp and city name, plus refers to function to get the forecast
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
  getForecast(response.data.coord);
}

//Gets the city from the search form then runs the API using city name to get weather data, then runs the function showTempCity
function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let apiKey = "0fbc2c49d4b2c78e5faff6668811ca96";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTempCity);
}

//Selects and adds event listener to the city search form, then runs searchCity when submitted
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

//Gets the city name using the lat long data although seems to be redundant given the function showTempCity seems to also produce city name
//function getCity(response) {
//let cityHere = response.data.locality;
//let cityHeading = document.querySelector("#current-city");
//cityHeading.innerHTML = cityHere;
//}

//Accesses lat and long to do 2 things: get weather and get city based on lat and long
function weatherHere(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "0fbc2c49d4b2c78e5faff6668811ca96";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=en&units=metric`;
  axios.get(weatherUrl).then(showTempCity);
  //let cityUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  //axios.get(cityUrl).then(getCity);
}

//Gets the position then tells it to run the weatherHere function with the data
function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(weatherHere);
}

//Selected location pin and added an event listener to run currentLocation function
let locationPin = document.querySelector(`#location-pin`);
locationPin.addEventListener("click", currentLocation);

//Celsius and Fahrenheit switch

//Function to run when fahrenheit switch clicked
function convertFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = `${Math.round(fahrenheitTemp)}°`;
}

//Function to run when celsius link clicked - conversion
function convertCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
}

//Created global variable, which can be accessed from within function
//Setting it initially as null, then making it the celsius temperature within the showTempCity function
//Now it represents the accurate temperature, rather than just what is in that HTML element
//Can be used for above calculation in the conversion
let celsiusTemperature = null;

//Added event listener to fahrenheit link when clicked
document
  .querySelector(`#fahrenheit`)
  .addEventListener("click", convertFahrenheit);

//Added event listener to celsius link when clicked
document.querySelector("#celsius").addEventListener("click", convertCelsius);

//Run a search of Sydney when page loads, as default
searchCity("Sydney");
