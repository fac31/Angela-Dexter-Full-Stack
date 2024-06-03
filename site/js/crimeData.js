import { addMarkerToMap, currentCrimeLocation } from "./map.js";
import { currentDateString } from "./dateFilter.js";
import { clusterCrimeData } from "./clusterDisplay.js";
// import { updateCrimeStats } from "./main.js";

const crimeTypeFilter = document.getElementById("crime");

function fetchPoliceCrimeData(latitude, longitude, crimeType) {
    // Fetch crime data and return a promise
    return fetch("/api/crime/location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            crime_type: crimeType,
            lat: latitude,
            lng: longitude,
            date: currentDateString,
        }),
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
}

export async function createMarkerCluster() {
    if (currentCrimeLocation.lat == null || currentCrimeLocation.lng == null)
        return;

    // const polyResp = fetch("/api/poly", { method: "POST" });
    const crimeType = crimeTypeFilter.value;

    const data = await fetchPoliceCrimeData(
        currentCrimeLocation.lat,
        currentCrimeLocation.lng,
        crimeType
    );

    clusterCrimeData(data);
}

crimeTypeFilter.addEventListener("change", () => {
    createMarkerCluster();
});

// // Combined function to fetch and process crime data from both APIs
// async function fetchAndProcessCrimeData(latitude, longitude, monthYear) {
//     // try {

//     //     // const [hereCrimeData, policeCrimeData] = await Promise.all([
//     //     //     fetchHereCrimeData(hereApiKey, latitude, longitude, radius),
//     //     //     fetchPoliceCrimeData(latitude, longitude, date),
//     //     // ]);
//     try {
//         const area = document.getElementById("area").value;
//         // const monthYear = document.getElementById("monthYear").value;
//         const crimeType = document.getElementById("crime").value;

//         // Extract year and month from monthYear input
//         const [year, month] = monthYear.split("-");

//         const dateString = `${year}-${month}`;

//         const policeCrimeData = await fetchPoliceCrimeData(
//             latitude,
//             longitude,
//             dateString,
//             crimeType
//         );

//         // // Update the crime stats section with the fetched data
//         // updateCrimeStats(policeCrimeData);
//     } catch (error) {
//         console.error("Error fetching crime data:", error);
//     }
// }

// // Define latitude and longitude variables with appropriate values
// const latitude = 52.629831; // Example latitude
// const longitude = -1.132503; // Example longitude
// const monthYear = "2023-02"; // Example monthYear

// Fetch and process crime data from both APIs
// fetchAndProcessCrimeData(latitude, longitude, monthYear);
