const apiKey = "6002cdee5fc55ef40b5203f466b55b58"; // Replace with your OpenWeatherMap API key
const weatherInfoDiv = document.getElementById("weather-info");
const countrySelect = document.getElementById("country-select");

// Predefined cities
const predefinedCities = ["New York", "London", "Tokyo", "Colombo", "Dubai"];

// Add predefined cities to the dropdown when a button is clicked
document.querySelectorAll(".city-btn").forEach(button => {
    button.addEventListener("click", () => {
        const city = button.dataset.city;
        if (![...countrySelect.options].some(option => option.value === city)) {
            const newOption = document.createElement("option");
            newOption.value = city;
            newOption.textContent = city;
            countrySelect.appendChild(newOption);
        }
        countrySelect.value = city; // Set the selected option to the clicked city
        fetchWeatherData(city);
    });
});

// Fetch list of countries and add to the dropdown
fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then(countries => {
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort alphabetically
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.name.common;
            option.textContent = country.name.common;
            countrySelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching countries:", error));

// Fetch weather data when a country/city is selected from the dropdown
countrySelect.addEventListener("change", () => {
    const selectedLocation = countrySelect.value;
    if (selectedLocation) {
        fetchWeatherData(selectedLocation);
    }
});

// Fetch weather data
function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(location, data);
            } else {
                alert("Weather data could not be fetched. Please try again.");
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// Display weather info
function displayWeatherData(location, data) {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const windSpeed = data.wind.speed;

    weatherInfoDiv.innerHTML = `
        <h2>${location}</h2>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Description:</strong> ${capitalizeFirstLetter(description)}</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    `;
    weatherInfoDiv.style.display = "block";
}

// Capitalize first letter helper
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

