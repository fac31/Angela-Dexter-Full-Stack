import { addMarkerToMap, map } from "./map.js";
import { currentDateString } from "./dateFilter.js";
// import { updateCrimeStats } from "./main.js";

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

export async function displayMarkersInLocation(place_id, lat, lng) {
    // const polyResp = fetch("/api/poly", { method: "POST" });

    const crimeType = document.getElementById("crime").value;

    const data = await fetchPoliceCrimeData(lat, lng, crimeType);

    clusterCrimeData(data);
}

let clusterLayerRef = null;

// Function to process and display crime data on the map
function clusterCrimeData(data) {
    if (clusterLayerRef) map.removeLayer(clusterLayerRef);

    let dataPoints = data.map(function (crime) {
        return new H.clustering.DataPoint(
            crime.location.latitude,
            crime.location.longitude
        );
    });

    let clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            // maximum radius of the neighbourhood
            eps: 10,
            // minimum weight of points required to form a cluster
            minWeight: 2,
        },
    });

    let clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    clusterLayerRef = clusteringLayer;

    map.addLayer(clusteringLayer);
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
// fetchAndProcessCrimeData(latitude, longitude, monthYear);
