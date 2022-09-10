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
  return `Last updated on ${currentDay}, at ${hours}:${minutes}`;
}

let currentTime = new Date();
let dateTimeElement = document.querySelector("#current-date-time");
dateTimeElement.innerHTML = formatDate(currentTime);

//Gives a day for the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//Displays the forecast with the coord data from below
//function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        `<div class="col-2">
          <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          />
          <div class="weather-forecast-temperatures">
          <span class="forecast-temp-min">
    ${Math.round(forecastDay.temp.min)}°</span> / 
          <strong class="forecast-temp-max">${Math.round(
            forecastDay.temp.max
          )}°</strong>
        </div>`;
    }
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
  let celsiusTemperature = response.data.main.temp;
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

//Uses city plugged into apiurl to then carry out showTempCity function
function searchCity(city) {
  let apiKey = "0fbc2c49d4b2c78e5faff6668811ca96";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTempCity);
}

//Gets the city submitted in the search engine, then sends it to searchCity function above
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

//Selects and adds event listener to the city search form, then runs searchCity when submitted
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

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

//Run a search of Sydney when page loads, as default
searchCity("Sydney");
