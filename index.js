const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m';

fetch(url)
   .then(response => {
    if (!response.ok) {
       throw new Error('Network response was not ok');
     }
     return response.json(); // Convert the response to JSON
  })
  .then(data => {
    console.log(data); // Log the data or process it as needed
     // You can now access data.hourly.temperature_2m or any other data returned by the API
   })
   .catch(error => {
     console.error('There was a problem with the fetch operation:', error);
   });

