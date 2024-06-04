import { centerOnCrimeLocation, map, setCrimeLocation } from "./map.js";
import { createMarkerCluster } from "./crimeData.js";

const areaInput = document.getElementById("area");
const areaSuggestions = document.getElementById("areaSuggestions");

function clearSuggestions(reset = false) {
    areaSuggestions.style.visibility = "hidden";
    areaSuggestions.replaceChildren();

    if (reset) {
        areaSuggestions.style.visibility = "visible";
    }
}

function suggestionStatus(status) {
    clearSuggestions(true);

    areaSuggestions.appendChild(document.createTextNode(status));
}

// Function to fetch location suggestions based on input
function fetchLocationSuggestions(input) {
    const url = `/api/suggestions/${input}`;

    suggestionStatus("Searching...");

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                console.error(
                    "Error fetching location suggestions",
                    response.status
                );
                suggestionStatus(
                    "An error occured and no locations could be found."
                );
                return;
            } else {
                return response.json();
            }
        })
        .then((places) => {
            if (places.length === 0) {
                suggestionStatus(
                    "No places could be found. Try a different search term."
                );
                return;
            }

            clearSuggestions(true);
            places.forEach((place) => {
                const placeName = place.place.name.trim();

                const li = document.createElement("li");
                li.classList.add("suggestions-item");
                li.textContent = placeName;
                areaSuggestions.appendChild(li);

                // Add click event to fill input with selected suggestion
                li.addEventListener("click", () => {
                    setCrimeLocation(
                        place.center.lat,
                        place.center.lng,
                        place.place.id
                    );
                    centerOnCrimeLocation();

                    createMarkerCluster();

                    // Update the input field with the selected suggestion
                    areaInput.value = placeName;

                    // Clear the suggestions dropdown
                    clearSuggestions();
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching location suggestions:", error);
            suggestionStatus(
                "An error occured and no locations could be found."
            );
        });
}

// Event listener for area input changes
areaInput.addEventListener("input", function () {
    // replace any characters that are not allowed
    const input = this.value.replace(/[^-_a-zA-Z0-9]/, "");

    if (input.length >= 2) {
        // Fetch suggestions only if input length is greater than 2
        fetchLocationSuggestions(input);
    } else {
        clearSuggestions(); // Clear suggestions if input length is less than 2
    }
});

// if the user clicks back onto the input after clicking away
// search for the place if there is one there
areaInput.addEventListener("focus", function () {
    const input = this.value.replace(/[^-_a-zA-Z0-9]/, "");

    if (input.length >= 2) {
        // Fetch suggestions only if input length is greater than 2
        fetchLocationSuggestions(input);
    }
});

// Hide suggestions when clicking outside the input field
document.addEventListener("click", (e) => {
    if (!areaInput.contains(e.target) && !areaSuggestions.contains(e.target)) {
        clearSuggestions();
    }
});
