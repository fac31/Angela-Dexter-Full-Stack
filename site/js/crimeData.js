import { currentCrimeLocation } from "./map.js";
import { currentDateString } from "./dateFilter.js";
import { clusterCrimeData, clearCluster } from "./clusterDisplay.js";
import { enabledViews, prevEnabledViews } from "./layers.js";
import { clearHeatmap, heatmapCrimeData } from "./heatmapDisplay.js";
// import { updateStats } from "./crimeStats.js";

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

export async function createMarkerCluster(shouldUpdateAll = true) {
    if (currentCrimeLocation.lat == null || currentCrimeLocation.lng == null)
        return;

    // const polyResp = fetch("/api/poly", { method: "POST" });
    const crimeType = crimeTypeFilter.value;

    const data = await fetchPoliceCrimeData(
        currentCrimeLocation.lat,
        currentCrimeLocation.lng,
        crimeType
    );

    // these conditions prevent having to update all the different layers each time one changes
    // for example, if you disable the heatmap with clusters enabled, we shouldnt update the clusters again
    // the only time they should all change is with a new filter, which is what shouldUpdateAll does
    if (
        (prevEnabledViews.cluster != enabledViews.cluster || shouldUpdateAll) &&
        enabledViews.cluster
    ) {
        clusterCrimeData(data);
    } else if (!enabledViews.cluster) {
        clearCluster();
    }

    if (
        (prevEnabledViews.heatmap != enabledViews.heatmap || shouldUpdateAll) &&
        enabledViews.heatmap
    ) {
        heatmapCrimeData(data);
    } else if (!enabledViews.heatmap) {
        clearHeatmap();
    }

}

crimeTypeFilter.addEventListener("change", () => {
    createMarkerCluster();
});
