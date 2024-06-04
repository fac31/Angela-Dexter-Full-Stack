window.HERE_API_KEY = "2jVwbhCihNJP6YbnvpTcYMaUso_xB6YMZWm4UiOjBLQ";
window.MAPTILER_API_KEY = "U6dlVfFVUNQwiAyFYJpp";
import { showCrimeDefinitions } from "./crimeDefinitions.js";

const viewDefinitionsBtn = document.getElementById("viewDefinitions");
if (viewDefinitionsBtn) {
    viewDefinitionsBtn.addEventListener("click", () => {
        showCrimeDefinitions();
    });
}

// import { fetchPoliceCrimeData } from "./crimeData.js";

// export let currentCrimeLocation = {
//     lat: null,
//     lng: null,
// };

// export function setCrimeLocation(lat, lng) {
//     currentCrimeLocation = { lat, lng };
// }

// const MAPTILER_URL = "https://api.maptiler.com/geocoding"; // Base URL for MapTiler Geocoding API

// document.addEventListener('DOMContentLoaded', function() {
//     const searchBar = document.getElementById('area');
//     const yearInput = document.getElementById('year');
//     const monthInput = document.getElementById('month');
//     const crimeSelect = document.getElementById('crime');

//     // Populate the year dropdown starting from 2021
//     const currentYear = new Date().getFullYear();
//     for (let year = currentYear; year >= 2021; year--) {
//         const option = document.createElement('option');
//         option.value = year;
//         option.textContent = year;
//         yearInput.appendChild(option);
//     }

//     // Handle location input changes
//     searchBar.addEventListener('input', function(event) {
//         const query = event.target.value;
//         if (query.length > 2) {
//             geocodeLocation(query);
//         }
//     });

//     // Handle changes in year, month, and crime type
//     yearInput.addEventListener('change', handleSearch);
//     monthInput.addEventListener('change', handleSearch);
//     crimeSelect.addEventListener('change', handleSearch);

//     async function geocodeLocation(query) {
//         try {
//             const suggestionsResp = await fetch(
//                 `${MAPTILER_URL}/${encodeURIComponent(query)}.json?` +
//                 new URLSearchParams({
//                     proximity: "ip",
//                     fuzzyMatch: true,
//                     limit: 5,
//                     country: "GB",
//                     key: window.MAPTILER_API_KEY, // Ensure this key is set in your environment
//                 })
//             );
//             const suggestions = await suggestionsResp.json();
//             if (suggestions.features.length > 0) {
//                 const location = suggestions.features[0].geometry.coordinates;
//                 setCrimeLocation(location[1], location[0]); // MapTiler returns [lng, lat]
//                 handleSearch();
//             } else {
//                 console.error('No location data found for query:', query);
//             }
//         } catch (error) {
//             console.error('Error geocoding location:', error);
//         }
//     }

//     async function handleSearch() {
//         try {
//             const crimeType = crimeSelect.value;
//             const year = yearInput.value;
//             const month = monthInput.value;
//             const { lat, lng } = currentCrimeLocation;

//             if (lat && lng && year && month) {
//                 const date = `${year}-${month}`;
//                 const data = await fetchPoliceCrimeData(lat, lng, crimeType, date);
//                 updateStats(data);
//             } else {
//                 console.error('Incomplete data for fetching crime statistics.');
//             }
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error.message);
//         }
//     }

// function updateStats(data) {
//     const statsContainer = document.getElementById('crimeStats');
//     statsContainer.innerHTML = '';

//     if (!Array.isArray(data)) {
//         console.error('Data format is not as expected:', data);
//         return;
//     }

//     let totalCount = data.length;

//     const totalCrimesText = document.createElement('div');
//     const monthYearString = `${monthInput.options[monthInput.selectedIndex].text} ${yearInput.value}`;
//     totalCrimesText.textContent = `${totalCount} crimes occurred in ${monthYearString}`;
//     statsContainer.appendChild(totalCrimesText);

//     const crimeCountsByCategory = {};

//     data.forEach(crime => {
//         const category = crime.category;
//         if (!crimeCountsByCategory[category]) {
//             crimeCountsByCategory[category] = 0;
//         }
//         crimeCountsByCategory[category]++;
//     });

//     for (const category in crimeCountsByCategory) {
//         const count = crimeCountsByCategory[category];
//         const statElement = document.createElement('div');
//         statElement.textContent = `${category}: ${count}`;
//         statsContainer.appendChild(statElement);
//     }
// }
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const searchBar = document.getElementById('area');
//     const yearInput = document.getElementById('year');
//     const monthInput = document.getElementById('month');
//     const crimeSelect = document.getElementById('crime');

//     // Populate the year dropdown starting from 2021
//     const currentYear = new Date().getFullYear();
//     for (let year = currentYear; year >= 2021; year--) {
//         const option = document.createElement('option');
//         option.value = year;
//         option.textContent = year;
//         yearInput.appendChild(option);
//     }

//     // Handle location input changes
//     searchBar.addEventListener('input', function(event) {
//         const query = event.target.value;
//         if (query.length > 2) {
//             geocodeLocation(query);
//         }
//     });

//     // Handle changes in year, month, and crime type
//     yearInput.addEventListener('change', handleSearch);
//     monthInput.addEventListener('change', handleSearch);
//     crimeSelect.addEventListener('change', handleSearch);

//     async function geocodeLocation(query) {
//         try {
//             const suggestionsResp = await fetch(
//                 `${MAPTILER_URL}/${encodeURIComponent(query)}.json?` +
//                 new URLSearchParams({
//                     proximity: "ip",
//                     fuzzyMatch: true,
//                     limit: 5,
//                     country: "GB",
//                     key: window.MAPTILER_API_KEY, // Ensure this key is set in your environment
//                 })
//             );
//             const suggestions = await suggestionsResp.json();
//             if (suggestions.features.length > 0) {
//                 const location = suggestions.features[0].geometry.coordinates;
//                 setCrimeLocation(location[1], location[0]); // MapTiler returns [lng, lat]
//                 handleSearch();
//             } else {
//                 console.error('No location data found for query:', query);
//             }
//         } catch (error) {
//             console.error('Error geocoding location:', error);
//         }
//     }

//     async function handleSearch() {
//         try {
//             const crimeType = crimeSelect.value;
//             const year = yearInput.value;
//             const month = monthInput.value;

//             // Ensure both year and month have valid values
//             if (year && month) {
//                 // Convert month to a zero-based index
//                 const monthIndex = parseInt(month) - 1;
//                 // Ensure monthIndex is within the range of 0-11
//                 if (monthIndex >= 0 && monthIndex < 12) {
//                     // Get latitude and longitude from currentCrimeLocation
//                     const { lat, lng } = currentCrimeLocation;
//                     const date = `${year}-${month.padStart(2, '0')}`; // Ensure month is two digits
//                     const data = await fetchPoliceCrimeData(lat, lng, crimeType, date);
//                     updateStats(data, year, month);
//                 } else {
//                     console.error('Invalid month:', month);
//                 }
//             } else {
//                 console.error('Invalid year or month:', year, month);
//             }
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error.message);
//         }
//     }

//     function updateStats(data, year, month) {
//         const statsContainer = document.getElementById('crimeStats');
//         statsContainer.innerHTML = '';

//         if (!Array.isArray(data)) {
//             console.error('Data format is not as expected:', data);
//             return;
//         }

//         const monthName = getMonthName(month);

//         const totalCount = data.length;
//         const totalCrimesText = document.createElement('div');
//         totalCrimesText.textContent = `${totalCount} crimes occurred in ${monthName} ${year}.`;
//         statsContainer.appendChild(totalCrimesText);

//         const crimeCountsByCategory = {};

//         data.forEach(crime => {
//             const category = crime.category;
//             if (!crimeCountsByCategory[category]) {
//                 crimeCountsByCategory[category] = 0;
//             }
//             crimeCountsByCategory[category]++;
//         });

//         for (const category in crimeCountsByCategory) {
//             const count = crimeCountsByCategory[category];
//             const statElement = document.createElement('div');
//             statElement.textContent = `${category}: ${count}`;
//             statsContainer.appendChild(statElement);
//         }
//     }

//     function getMonthName(month) {
//         const months = [
//             'January', 'February', 'March', 'April', 'May', 'June', 'July',
//             'August', 'September', 'October', 'November', 'December'
//         ];
//         return months[parseInt(month) - 1] || 'Invalid Month';
//     }
// });
