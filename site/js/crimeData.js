import { addMarkerToMap } from "./map.js";
// import { updateCrimeStats } from "./main.js";

function fetchPoliceCrimeData(latitude, longitude, date, crimeType) {
    let url = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${monthYear}`;

    // Append crime type filter if specified
    if (crimeType) {
        url += `&category=${crimeType}`;
    }

    // Log the constructed URL for debugging
    console.log("Request URL:", url);

    // Fetch crime data and return a promise
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
}

// Function to process and display crime data on the map
function processCrimeData(data) {
    data.forEach((crime) => {
        addMarkerToMap(
            map,
            crime.lat,
            crime.lng,
            `${crime.type}: ${crime.count}`
        );
    });
}

// Combined function to fetch and process crime data from both APIs
async function fetchAndProcessCrimeData(latitude, longitude, monthYear) {
    // try {

    //     // const [hereCrimeData, policeCrimeData] = await Promise.all([
    //     //     fetchHereCrimeData(hereApiKey, latitude, longitude, radius),
    //     //     fetchPoliceCrimeData(latitude, longitude, date),
    //     // ]);
    try {
        const area = document.getElementById("area").value;
        // const monthYear = document.getElementById("monthYear").value;
        const crimeType = document.getElementById("crime").value;

        // Extract year and month from monthYear input
        const [year, month] = monthYear.split("-");

        const dateString = `${year}-${month}`;

        const policeCrimeData = await fetchPoliceCrimeData(
            latitude,
            longitude,
            dateString,
            crimeType
        );

        // // Update the crime stats section with the fetched data
        // updateCrimeStats(policeCrimeData);
    } catch (error) {
        console.error("Error fetching crime data:", error);
    }
}

// Define latitude and longitude variables with appropriate values
const latitude = 52.629831; // Example latitude
const longitude = -1.132503; // Example longitude
const monthYear = "2023-02"; // Example monthYear

// Fetch and process crime data from both APIs
fetchAndProcessCrimeData(latitude, longitude, monthYear);
