const mapElem = document.getElementById("map");

const latitude = 51.5074; // Coordinates for London
const longitude = -0.1278;

// Initialize HERE Map
const platform = new H.service.Platform({
    apikey: window.HERE_API_KEY,
});

const defaultLayers = platform.createDefaultLayers();
export const map = new H.Map(mapElem, defaultLayers.vector.normal.map, {
    center: { lat: latitude, lng: longitude },
    zoom: 10,
    pixelRatio: window.devicePixelRatio || 1,
});

window.addEventListener("resize", () => map.getViewPort().resize());

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Function to add a marker to the map
export function addMarkerToMap(map, lat, lng, data) {
    const marker = new H.map.Marker({ lat, lng });
    marker.setData(data);
    map.addObject(marker);
}
