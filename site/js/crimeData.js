import { addMarkerToMap, currentCrimeLocation, map } from "./map.js";
import { currentDateString } from "./dateFilter.js";
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
    // const polyResp = fetch("/api/poly", { method: "POST" });
    const crimeType = crimeTypeFilter.value;

    const data = await fetchPoliceCrimeData(
        currentCrimeLocation.lat,
        currentCrimeLocation.lng,
        crimeType
    );

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

crimeTypeFilter.addEventListener("change", () => {
    createMarkerCluster();
});