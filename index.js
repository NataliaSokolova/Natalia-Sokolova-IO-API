const lat = 47.6062; // Latitude of Seattle
const lon = -122.3321; // Longitude of Seattle

// Fetch weather data from Open-Meteo API
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Convert response to JSON
    })
    .then(data => {
        // Store data globally so it can be used later when switching views
        window.weatherData = data;

        // Initially display current weather
        displayCurrentWeather(data.current_weather);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Function to display the current weather
function displayCurrentWeather(currentWeather) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = ''; // Clear previous data

    const weatherInfo = document.createElement('h2');
    weatherInfo.textContent = `Current Temperature in Seattle: ${currentWeather.temperature}°C`;
    currentWeatherDiv.appendChild(weatherInfo);
}

// Function to display hourly forecast data with actual time in AM/PM format
function displayHourlyForecast(hourlyTemps) {
    const hourlyForecastDiv = document.getElementById('hourlyForecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous data

    const heading = document.createElement('h2');
    heading.textContent = 'Hourly Temperature Forecast in Seattle';
    hourlyForecastDiv.appendChild(heading);

    const forecastList = document.createElement('ul');
    let currentTime = new Date(); // Get the current date and time

    hourlyTemps.forEach((temp, index) => {
        const listItem = document.createElement('li');

        // Increment time by the forecasted hour
        const futureTime = new Date(currentTime.getTime() + index * 60 * 60 * 1000);
        listItem.textContent = `${formatTime(futureTime)}: ${temp}°C`;

        forecastList.appendChild(listItem);
    });

    hourlyForecastDiv.appendChild(forecastList);
}

// Helper function to format time in 12-hour 
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = 'AM';

    if (hours >= 12) {
        period = 'PM';
    }
    if (hours > 12) {
        hours -= 12;
    }
    if (hours === 0) {
        hours = 12;
    }

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${period}`;
}

// Add event listeners for buttons to switch views
document.getElementById('showCurrentWeatherBtn').addEventListener('click', () => {
    document.getElementById('currentWeather').style.display = 'block';
    document.getElementById('hourlyForecast').style.display = 'none';

    // If current weather hasn't been displayed yet
    if (!document.getElementById('currentWeather').innerHTML) {
        displayCurrentWeather(window.weatherData.current_weather);
    }
});

document.getElementById('showHourlyForecastBtn').addEventListener('click', () => {
    document.getElementById('currentWeather').style.display = 'none';
    document.getElementById('hourlyForecast').style.display = 'block';

    // Ensure the hourly forecast data is available
    if (window.weatherData && window.weatherData.hourly && window.weatherData.hourly.temperature_2m) {
        displayHourlyForecast(window.weatherData.hourly.temperature_2m);
    } else {
        console.error('Hourly forecast data not available.');
    }
});
