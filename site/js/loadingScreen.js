const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const loadingIcon = document.getElementById("loading-icon");

const defaultLoadingText = document.createTextNode("Loading...");

loadingScreen.style.visibility = "hidden";

export function showLoadingScreen(message) {
    loadingScreen.style.visibility = "visible";
    loadingIcon.alt = message;
    loadingText.replaceChildren(document.createTextNode(message));
}

export function updateLoadingScreen(message) {
    loadingIcon.alt = message;
    loadingText.replaceChildren(document.createTextNode(message));
}

export function hideLoadingScreen() {
    loadingScreen.style.visibility = "hidden";
    loadingText.replaceChildren(defaultLoadingText);
}
