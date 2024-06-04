import { addMarkerToMap, currentCrimeLocation } from "./map.js";
import { currentDateString } from "./dateFilter.js";
import { clusterCrimeData } from "./clusterDisplay.js";
// import { updateCrimeStats } from "./main.js";

const crimeTypeFilter = document.getElementById("crime");

export async function fetchPoliceCrimeData(latitude, longitude, crimeType) {
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