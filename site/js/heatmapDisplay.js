import { addLayer, removeLayer } from "./map.js";

let heatmapLayerRef = null;

export function heatmapCrimeData(data) {
    clearHeatmap();

    const heatmapProvider = new H.data.heatmap.Provider({
        colors: new H.data.heatmap.Colors(
            {
                0: "#008", // dark blue
                0.2: "#0b0", // medium green
                0.5: "#ff0", // yellow
                0.7: "#f00", // red
            },
            true
        ),
        opacity: 0.6,
        // Paint assumed values in regions where no data is available
        assumeValues: true,
    });

    heatmapProvider.addData(
        data.map((crime) => ({
            lat: crime.location.latitude,
            lng: crime.location.longitude,
        }))
    );

    const heatmapLayer = new H.map.layer.TileLayer(heatmapProvider);
    heatmapLayerRef = heatmapLayer;

    // Add a layer for the heatmap provider to the map:
    addLayer(heatmapLayerRef);
}

export function clearHeatmap() {
    if (heatmapLayerRef) removeLayer(heatmapLayerRef);
}
