import { addLayer, removeLayer } from "./map.js";

let heatmapLayerRef = null;

export function heatmapCrimeData(data) {
    if (heatmapLayerRef) removeLayer(heatmapLayerRef);

    const heatmapProvider = new H.data.heatmap.Provider({
        colors: new H.data.heatmap.Colors(
            {
                0: "blue",
                0.5: "yellow",
                1: "red",
            },
            true
        ),
        opacity: 0.6,
        // Paint assumed values in regions where no data is available
        assumeValues: true,
    });

    // Add the data:
    heatmapProvider.addData([
        { lat: 52, lng: 1, value: 1 },
        { lat: 53, lng: 2, value: 2 },
    ]);

    const heatmapLayer = new H.map.layer.TileLayer(heatmapProvider);
    heatmapLayerRef = heatmapLayer;

    // Add a layer for the heatmap provider to the map:
    addLayer(heatmapLayer);
}
