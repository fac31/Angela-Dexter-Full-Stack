import { createMarkerCluster } from "./crimeData.js";

const clusterCheck = document.getElementById("cluster");
const heatmapCheck = document.getElementById("heatmap");

clusterCheck.checked = true;

export let enabledViews = {
    cluster: clusterCheck.checked ?? true,
    heatmap: heatmapCheck.checked ?? false,
};

export let prevEnabledViews = { ...enabledViews };

clusterCheck.addEventListener("change", (e) => {
    prevEnabledViews = { ...enabledViews };

    enabledViews.cluster = e.target.checked;

    createMarkerCluster(false);
});

heatmapCheck.addEventListener("change", (e) => {
    prevEnabledViews = { ...enabledViews };

    enabledViews.heatmap = e.target.checked;

    createMarkerCluster(false);
});
