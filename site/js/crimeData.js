import { addMarkerToMap } from "./map.js";

function fetchPoliceCrimeData(latitude, longitude) {
    const date = Date.now();
    const dateString = date.toISOString().substring(0, 10);

    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${dateString}`;

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
async function fetchAndProcessCrimeData() {
    try {
        const [hereCrimeData, policeCrimeData] = await Promise.all([
            // fetchHereCrimeData(hereApiKey, latitude, longitude, radius), // Pass hereApiKey, latitude, longitude, and radius
            fetchPoliceCrimeData(latitude, longitude, date),
        ]);

        // Process the responses and update the map accordingly
        processCrimeData(hereCrimeData.incidents);
        processCrimeData(policeCrimeData);
    } catch (error) {
        console.error("Error fetching crime data:", error);
    }
}

// Fetch and process crime data from both APIs
fetchAndProcessCrimeData();
