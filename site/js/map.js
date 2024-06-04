const mapElem = document.getElementById("map");
window.HERE_API_KEY = "2jVwbhCihNJP6YbnvpTcYMaUso_xB6YMZWm4UiOjBLQ";
const latitude = 51.5074; // Coordinates for London
const longitude = -0.1278;

// lat/lng of the area the user searched
export let currentCrimeLocation = {
    lat: null,
    lng: null,
    id: null,
};

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
export function addMarkerToMap(lat, lng, data) {
    const marker = new H.map.Marker({ lat, lng });
    marker.setData(data);
    map.addObject(marker);
}

export function setCrimeLocation(lat, lng, id) {
    currentCrimeLocation = { lat, lng, id };
}

export function centerOnCrimeLocation() {
    map.setCenter(currentCrimeLocation);
}

export function removeLayer(layer) {
    map.removeLayer(layer);
}

export function addLayer(layer) {
    map.addLayer(layer);
}

export function addBubble(bubble) {
    ui.addBubble(bubble);
}
