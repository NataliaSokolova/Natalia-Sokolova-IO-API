// Function to fetch weather data for a given city, including daily forecast and additional details
function fetchWeatherByCity(city) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;

    // Fetch latitude and longitude for the city using Nominatim API
    fetch(geoApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found.');
            }
            return response.json();
        })
        .then(locationData => {
            if (locationData.length === 0) {
                throw new Error('City not found.');
            }
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;

            // Fetch weather data including current weather, UV index, wind speed, and 4-day forecast
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max&current_weather=true&timezone=auto`;

            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data could not be fetched.');
            }
            return response.json();
        })
        .then(weatherData => {
            window.weatherData = weatherData; // Store weather data globally
            displayCurrentWeather(weatherData.current_weather); // Display current weather
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to display the current weather with UV index and wind
function displayCurrentWeather(currentWeather) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = ''; // Clear previous data

    // Create elements for weather data
    const weatherInfo = document.createElement('h2');
    weatherInfo.textContent = `Current Temperature: ${currentWeather.temperature}°C`;

    const windInfo = document.createElement('p');
    windInfo.textContent = `Wind Speed: ${currentWeather.windspeed} km/h`;

    const uvIndexInfo = document.createElement('p');
    uvIndexInfo.textContent = `UV Index: ${window.weatherData.daily.uv_index_max[0]}`;

    // Add weather icon based on condition code
    const weatherIcon = document.createElement('img');
    weatherIcon.src = getWeatherIcon(currentWeather.weathercode);  // Fetch the right icon
    weatherIcon.alt = 'Weather Icon';
    weatherIcon.classList.add('weather-icon');  // Adding a class for custom styling

    // Append all elements to the div
    currentWeatherDiv.appendChild(weatherInfo);
    currentWeatherDiv.appendChild(windInfo);
    currentWeatherDiv.appendChild(uvIndexInfo);
    currentWeatherDiv.appendChild(weatherIcon);
}

// Function to map weather codes to icons (ensure the paths to your icons are correct)
function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: 'icons/clear-sky.png',        // Clear sky
        1: 'icons/partly-cloudy.png',    // Partly cloudy
        2: 'icons/cloudy.png',           // Cloudy
        3: 'icons/rain.png',             // Rain
        45: 'icons/fog.png',             // Fog
        51: 'icons/drizzle.png',         // Drizzle
        61: 'icons/light-rain.png',      // Light rain
        80: 'icons/heavy-rain.png',      // Heavy rain
        95: 'icons/storm.png',           // Thunderstorm
        // Add more weather codes as needed
    };

    // Return corresponding icon or default if not found
    return iconMap[weatherCode] || 'icons/default.png';
}

// Event listener for 'Search City' button
document.getElementById('showCurrentWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;

    if (city) {
        fetchWeatherByCity(city); // Fetch and display weather for the entered city
        document.getElementById('currentWeather').style.display = 'block';
        document.getElementById('hourlyForecast').style.display = 'none';
    } else {
        alert('Please enter a city name');
    }
});

// Event listener for 'Show 4 Days Forecast' button
document.getElementById('showHourlyForecastBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;

    // Check if the user has entered a city and weather data is available for that city
    if (city && window.weatherData && window.weatherData.daily) {
        displayFourDayForecast(window.weatherData.daily);
        document.getElementById('currentWeather').style.display = 'none';
        document.getElementById('hourlyForecast').style.display = 'block';
    } else if (!city) {
        alert('Please enter a city name.');
    } else {
        alert('4 days forecast data not available.');
    }
});

// Function to display 4 days forecast with days of the week, UV index, and temperature
function displayFourDayForecast(dailyTemps) {
    const forecastDiv = document.getElementById('hourlyForecast');
    forecastDiv.innerHTML = ''; // Clear previous data

    const heading = document.createElement('h2');
    heading.textContent = '4 Days Temperature Forecast';
    forecastDiv.appendChild(heading);

    const forecastList = document.createElement('ul');

    // Get the current date and use it to calculate the next 4 days
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    dailyTemps.temperature_2m_max.forEach((maxTemp, index) => {
        const minTemp = dailyTemps.temperature_2m_min[index];
        const uvIndex = dailyTemps.uv_index_max[index];

        // Calculate the day of the week
        const futureDate = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() + index); // Increment date by index (0 = today)

        const dayOfWeek = daysOfWeek[futureDate.getDay()]; // Get day of the week name

        const listItem = document.createElement('li');
        listItem.textContent = `${dayOfWeek}: Max Temp: ${maxTemp}°C, Min Temp: ${minTemp}°C, UV Index: ${uvIndex}`;

        forecastList.appendChild(listItem);
    });

    forecastDiv.appendChild(forecastList);
}
