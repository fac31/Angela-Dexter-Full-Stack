import { addLayer, removeLayer } from "./map.js";

let polygonLayerRef = null;

export function displayPolygon(geojson) {
    clearPolygon();

    const reader = new H.data.geojson.Reader(null, {
        // This function is called each time parser detects a new map object
        style: function (mapObject) {
            // Parsed geo objects could be styled using setStyle method
            if (mapObject instanceof H.map.Polygon) {
                mapObject.setStyle({
                    fillColor: "rgba(221, 117, 255, 0.3)",
                    strokeColor: "rgba(0, 0, 255, 0.2)",
                    lineWidth: 3,
                });
            }
        },
    });

    // Start parsing the data
    reader.parseData(geojson);

    const polygonLayer = reader.getLayer();
    polygonLayerRef = polygonLayer;

    // Add layer which shows GeoJSON data on the map
    addLayer(polygonLayer);
}

export function clearPolygon() {
    if (polygonLayerRef) removeLayer(polygonLayerRef);
}
