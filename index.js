// const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m';

// fetch(url)
//    .then(response => {
//     if (!response.ok) {
//        throw new Error('Network response was not ok');
//      }
//      return response.json(); // Convert the response to JSON
//   })
//   .then(data => {
//     console.log(data); // Log the data or process it as needed
//      // You can now access data.hourly.temperature_2m or any other data returned by the API
//    })
//    .catch(error => {
//      console.error('There was a problem with the fetch operation:', error);
//    });



// // Container to display weather data
// const weatherDataDiv = document.getElementById('weatherData');

// // Function to fetch and display current weather data for Seattle
// function fetchWeather() {
//     const url = 'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true';

//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); 
//         })
//         .then(data => {
//             displayWeatherData(data.current_weather); // Call the display function
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }

// // Function to display current weather data  in Seattle
// function displayWeatherData(weather) {
//     weatherDataDiv.innerHTML = ''; // Clear previous data

//     const heading = document.createElement('h2');
//     heading.textContent = 'Current Weather in Seattle';
//     weatherDataDiv.appendChild(heading);

//     const temperature = document.createElement('p');
//     temperature.textContent = `Temperature: ${weather.temperature}°C`;
//     weatherDataDiv.appendChild(temperature);

//     const windSpeed = document.createElement('p');
//     windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
//     weatherDataDiv.appendChild(windSpeed);

 
// }

// // Initial fetch for Seattle weather data
// fetchWeather();


   




   


// Container for displaying weather data
const currentWeatherDiv = document.getElementById('currentWeatherData');
const hourlyForecastDiv = document.getElementById('hourlyForecastData');

// Function to fetch and display current weather data for Seattle
function fetchCurrentWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(data => {
            displayCurrentWeather(data.current_weather); // Display current weather
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to fetch and display hourly temperature forecast for Seattle
function fetchHourlyForecast() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&hourly=temperature_2m';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(data => {
            displayHourlyForecast(data.hourly.temperature_2m); // Display hourly forecast
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display current weather data
function displayCurrentWeather(weather) {
    currentWeatherDiv.innerHTML = ''; // Clear previous data

    const heading = document.createElement('h2');
    heading.textContent = 'Current Weather in Seattle';
    currentWeatherDiv.appendChild(heading);

    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${weather.temperature}°C`;
    currentWeatherDiv.appendChild(temperature);

    const windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
    currentWeatherDiv.appendChild(windSpeed);
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyTemps) {
    hourlyForecastDiv.innerHTML = ''; // Clear previous data

    const heading = document.createElement('h2');
    heading.textContent = 'Hourly Temperature Forecast in Seattle';
    hourlyForecastDiv.appendChild(heading);

    const forecastList = document.createElement('ul');
    hourlyTemps.forEach((temp, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Hour ${index + 1}: ${temp}°C`;
        forecastList.appendChild(listItem);
    });

    hourlyForecastDiv.appendChild(forecastList);
}

// Fetch both data points on page load
fetchCurrentWeather();
fetchHourlyForecast();
