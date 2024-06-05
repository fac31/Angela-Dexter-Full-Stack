import { currentCrimeLocation } from "./map.js";
import { currentDateString } from "./dateFilter.js";
import { clusterCrimeData, clearCluster } from "./clusterDisplay.js";
import { enabledViews, prevEnabledViews } from "./layers.js";
import { clearHeatmap, heatmapCrimeData } from "./heatmapDisplay.js";
import { clearPolygon, displayPolygon } from "./displayPolygon.js";
import { updateStats } from "./crimeStats.js";
import {
    hideLoadingScreen,
    showLoadingScreen,
    updateLoadingScreen,
} from "./loadingScreen.js";

const crimeTypeFilter = document.getElementById("crime");

// we dont want to keep requesting new data if not required
let cachedCrimeData = null;
let cachedPolyData = null;

export async function fetchPoliceCrimeData(polygon) {
    // Fetch crime data and return a promise
    return fetch("/api/crime/location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            polygon: polygon,
            date: currentDateString,
        }),
    }).then((response) => {
        if (response.status === 503) {
            updateLoadingScreen("Area too large! Try a smaller area");
        }

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
}

async function fetchPolyData() {
    return fetch("/api/poly", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            place_id: currentCrimeLocation.id,
        }),
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
}

function displayFromData(crimeData, polyData, shouldUpdateAll) {
    // these conditions prevent having to update all the different layers each time one changes
    // for example, if you disable the heatmap with clusters enabled, we shouldnt update the clusters again
    // the only time they should all change is with a new filter, which is what shouldUpdateAll does
    if (
        (prevEnabledViews.cluster != enabledViews.cluster || shouldUpdateAll) &&
        enabledViews.cluster
    ) {
        clusterCrimeData(crimeData);
    } else if (!enabledViews.cluster) {
        clearCluster();
    }

    if (
        (prevEnabledViews.heatmap != enabledViews.heatmap || shouldUpdateAll) &&
        enabledViews.heatmap
    ) {
        heatmapCrimeData(crimeData);
    } else if (!enabledViews.heatmap) {
        clearHeatmap();
    }

    if (
        (prevEnabledViews.polygon != enabledViews.polygon || shouldUpdateAll) &&
        enabledViews.polygon
    ) {
        displayPolygon(polyData.geojson);
    } else if (!enabledViews.polygon) {
        clearPolygon();
    }

    updateStats(crimeData);

    hideLoadingScreen();
}

export async function createMarkerCluster(shouldUpdateAll = true) {
    if (currentCrimeLocation.lat == null || currentCrimeLocation.lng == null)
        return;

    showLoadingScreen("Getting Location...");

    // dont fetch any data unless we really have to
    let polyData;
    if (shouldUpdateAll) {
        polyData = await fetchPolyData();
        cachedPolyData = polyData;
    } else {
        polyData = cachedPolyData;
    }

    updateLoadingScreen("Getting Crimes...");

    let crimeData;
    if (shouldUpdateAll) {
        const crimeType = crimeTypeFilter.value;

        // the fetch now always requests every type of crime, and we manually do the filtering
        crimeData = await fetchPoliceCrimeData(polyData.crimePoly);
        // we want to cache the full data set
        cachedCrimeData = crimeData;

        if (crimeType !== "all-crime") {
            // and then only display the filtered data
            crimeData = filterCachedCrimeData(crimeType);
        }
    } else {
        crimeData = cachedCrimeData;
    }

    displayFromData(crimeData, polyData, shouldUpdateAll);
}

function filterCachedCrimeData(crimeType) {
    return cachedCrimeData.filter((crime) => crime.category === crimeType);
}

crimeTypeFilter.addEventListener("change", () => {
    let filteredData = cachedCrimeData;

    if (crimeTypeFilter.value !== "all-crime") {
        filteredData = filterCachedCrimeData(crimeTypeFilter.value);
    }

    displayFromData(filteredData, cachedPolyData, true);
});
