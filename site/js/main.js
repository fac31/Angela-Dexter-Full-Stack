window.HERE_API_KEY = "2jVwbhCihNJP6YbnvpTcYMaUso_xB6YMZWm4UiOjBLQ";
import { showCrimeDefinitions } from "./crimeDefinitions.js";
// import { fetchPoliceCrimeData } from "./crimeData.js"; // Import fetchPoliceCrimeData
// import { currentDateString } from "./dateFilter.js";
// import { createCrimeFreqPie} from "./charts.js"
// import * as Highcharts from 'highcharts';
import { fetchPoliceCrimeData } from "./crimeData.js";
document.addEventListener("DOMContentLoaded", () => {
    const viewDefinitionsBtn = document.getElementById("viewDefinitions");
    if (viewDefinitionsBtn) {
        viewDefinitionsBtn.addEventListener("click", () => {
            showCrimeDefinitions();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the search bar input
    const searchBar = document.getElementById('area');
    searchBar.addEventListener('input', function(event) {
        const query = event.target.value;
        handleSearch(query);
    });

    async function handleSearch(query) {
        try {
            // You need to specify the latitude, longitude, and crimeType for fetchPoliceCrimeData
            // Assuming you have some default values for these
            const latitude = 51.509865; // Example: Latitude for London
            const longitude = -0.118092; // Example: Longitude for London
            const crimeType = "all-crime"; // Example: Default crime type
            const data = await fetchPoliceCrimeData(latitude, longitude, crimeType);
            
            // Process the fetched data
            updateStats(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    }

    function updateStats(data) {
        // Clear previous statistics
        const statsContainer = document.getElementById('crimeStats');
        statsContainer.innerHTML = '';

        // Check if data is an array (assuming it should be an array of crime objects)
        if (!Array.isArray(data)) {
            console.error('Data format is not as expected:', data);
            return;
        }

        // Calculate total count of crimes
        let totalCount = data.length;

        // Create and append total count of crimes text
        const totalCrimesText = document.createElement('div');
        const currentDate = new Date();
        const monthYearString = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
        totalCrimesText.textContent = `${totalCount} crimes occurred in ${monthYearString}`;
        statsContainer.appendChild(totalCrimesText);

        // Create a map to store crime counts by category
        const crimeCountsByCategory = {};

        // Iterate through the data to count crimes by category
        data.forEach(crime => {
            const category = crime.category;
            if (!crimeCountsByCategory[category]) {
                crimeCountsByCategory[category] = 0;
            }
            crimeCountsByCategory[category]++;
        });

        // Create and append new statistic elements for each crime category
        for (const category in crimeCountsByCategory) {
            const count = crimeCountsByCategory[category];
            const statElement = document.createElement('div');
            statElement.textContent = `${category}: ${count}`;
            statsContainer.appendChild(statElement);
        }
    }
});
