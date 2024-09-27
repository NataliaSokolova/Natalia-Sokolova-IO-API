// Function to fetch weather data for a given city, including daily forecast and additional details
function fetchWeatherByCity(city) {
  const geoApiUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;

  // Fetch latitude and longitude for the city using Nominatim API
  fetch(geoApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((locationData) => {
      if (locationData.length === 0) {
        throw new Error("City not found.");
      }
      const lat = locationData[0].lat;
      const lon = locationData[0].lon;

      // Fetch weather data including current weather, UV index, wind speed, and 7-day forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_mean&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,pressure_msl,surface_pressure&minutely_15=shortwave_radiation,direct_radiation&current_weather=true&timezone=auto`;
      return fetch(weatherUrl);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather data could not be fetched.");
      }
      return response.json();
    })
    .then((weatherData) => {
      window.weatherData = weatherData; // Store weather data globally
      displayCurrentWeather(weatherData.current_weather,city); // Display current weather and city
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to display the current weather with UV index and wind
function displayCurrentWeather(currentWeather,city) {
  const currentWeatherDiv = document.getElementById("currentWeather");
  currentWeatherDiv.innerHTML = ""; // Clear previous data

  // Create elements for weather data
  const weatherInfo = document.createElement("h2");
  weatherInfo.textContent = `Current Temperature in ${city}: ${currentWeather.temperature}°C`;

  const windInfo = document.createElement("p");
  windInfo.textContent = `Wind Speed: ${currentWeather.windspeed} km/h`;

  const uvIndexInfo = document.createElement("p");
  uvIndexInfo.textContent = `UV Index: ${window.weatherData.daily.uv_index_max[0]}`;

  const pressureInfo = document.createElement("p");
  pressureInfo.textContent = `Pressure: ${window.weatherData.hourly.pressure_msl[0]} hPa`;

  const sunriseTime = window.weatherData.daily.sunrise[0];
  const hour = sunriseTime.split("T")[1];
  const sunriseInfo = document.createElement("p");
  sunriseInfo.textContent = `Sunrise: ${hour} AM`;

  const sunsetTime = window.weatherData.daily.sunset[0];
  const sethour = sunsetTime.split("T")[1];
  const sunsetInfo = document.createElement("p");
  sunsetInfo.textContent = `Sunset: ${sethour} PM`;

  const precipitationInfo = document.createElement("p");
  precipitationInfo.textContent = `Precipitation probability: ${window.weatherData.daily.precipitation_probability_mean[0]} %`;

  const radiationInfo = document.createElement("p");
  radiationInfo.textContent = `Radiation: ${window.weatherData.minutely_15.direct_radiation[0]} W/m² `;

  // Add weather icon based on condition code
  const weatherIcon = document.createElement("img");
  weatherIcon.src = getWeatherIcon(currentWeather.weathercode); // Fetch the right icon
  weatherIcon.alt = "Weather Icon";
  weatherIcon.classList.add("weather-icon"); // Adding a class for custom styling

  // Append all elements to the div
  currentWeatherDiv.appendChild(weatherInfo);
  currentWeatherDiv.appendChild(weatherIcon);
  currentWeatherDiv.appendChild(windInfo);
  currentWeatherDiv.appendChild(uvIndexInfo);
  currentWeatherDiv.appendChild(pressureInfo);
  currentWeatherDiv.appendChild(sunriseInfo);
  currentWeatherDiv.appendChild(sunsetInfo);
  currentWeatherDiv.appendChild(precipitationInfo);
  currentWeatherDiv.appendChild(radiationInfo);
}

// Function to map weather codes to icons (ensure the paths to your icons are correct)
function getWeatherIcon(weatherCode) {
  const iconMap = {
    0: "icons/clear-sky.png", // Clear sky
    1: "icons/partly-cloudy.png", // Partly cloudy
    2: "icons/cloudy.png", // Cloudy
    3: "icons/rain.png", // Rain
    45: "icons/fog.png", // Fog
    51: "icons/drizzle.png", // Drizzle
    61: "icons/light-rain.png", // Light rain
    80: "icons/heavy-rain.png", // Heavy rain
    95: "icons/storm.png", // Thunderstorm
    // Add more weather codes as needed
  };

  // Return corresponding icon or default if not found
  return iconMap[weatherCode] || "icons/default.png";
}

// Event listener for 'Search City' button
document
  .getElementById("showCurrentWeatherBtn")
  .addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;

    if (city) {
      fetchWeatherByCity(city); // Fetch and display weather for the entered city
      document.getElementById("currentWeather").style.display = "block";
      document.getElementById("sevendaysForecast").style.display = "none";
    } else {
      alert("Please enter a city name");
    }
  });

// Event listener for 'Show 7 Days Forecast' button
document
  .getElementById("showDailyForecastBtn")
  .addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;

    // Check if the user has entered a city and weather data is available for that city
    if (city && window.weatherData && window.weatherData.daily) {
      displaySevenDayForecast(window.weatherData.daily,city);
      document.getElementById("currentWeather").style.display = "none";
      document.getElementById("sevendaysForecast").style.display = "block";
    } else if (!city) {
      alert("Please enter a city name.");
    } else {
      alert("7 days forecast data not available.");
    }
  });

// Function to display 7 days forecast with days of the week, UV index, and temperature
function displaySevenDayForecast(dailyTemps,city) {
  const forecastDiv = document.getElementById("sevendaysForecast");
  forecastDiv.innerHTML = ""; // Clear previous data

  const heading = document.createElement("h2");
  heading.textContent = `7 Days Temperature Forecast in ${city}`;
  heading.classList.add('dailyheading')
  forecastDiv.appendChild(heading);


  const forecastList = document.createElement("div"); // Create the forecast list container
  forecastList.classList.add("forecast-container");


  // Get the current date and use it to calculate the next 7 days
  const currentDate = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  dailyTemps.temperature_2m_max.forEach((maxTemp, index) => {
    
    const minTemp = dailyTemps.temperature_2m_min[index];
    const uvIndex = dailyTemps.uv_index_max[index];
    const sunrise = dailyTemps.sunrise[index];
    const hour = sunrise.split("T")[1];
    const sunset = dailyTemps.sunset[index];
    const sethour = sunset.split("T")[1];

  

    // Calculate the day of the week
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + index); // Increment date by index (0 = today)

    const dayOfWeek = daysOfWeek[futureDate.getDay()]; // Get day of the week name

    const forecastBlock = document.createElement("div");
    forecastBlock.classList.add("forecast-block");

    forecastBlock.innerHTML = `
          
          <span class="day-of-week">${dayOfWeek}</span> 
          <span class="max-temp">High temperature: ${maxTemp}°C</span> 
          <span class="min-temp">Low temperature: ${minTemp}°C</span> 
          <span class="uv-index">Max UV Index: ${uvIndex}</span>
          <span class="sunrise">Sunrise: ${hour} AM</span>
          <span class="sunset">Sunset: ${sethour} PM</span>
          
      `;

      forecastList.appendChild(forecastBlock);
  });

  forecastDiv.appendChild(forecastList);
}



