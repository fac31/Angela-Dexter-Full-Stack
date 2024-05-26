import { map, addMarkerToMap } from "./map.js";

const areaInput = document.getElementById("area");
const areaSuggestions = document.getElementById("areaSuggestions");

function clearSuggestions() {
    areaSuggestions.style.visibility = "hidden";
    areaSuggestions.replaceChildren();
}

// Function to fetch location suggestions based on input
function fetchLocationSuggestions(input) {
    const url = `/api/suggestions/${input}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((places) => {
            console.log(places);

            clearSuggestions();
            areaSuggestions.style.visibility = "visible";

            places.forEach((place) => {
                const placeName = place.place_name;

                const li = document.createElement("li");
                li.classList.add("suggestions-item");
                li.textContent = placeName;
                areaSuggestions.appendChild(li);

                // Add click event to fill input with selected suggestion
                li.addEventListener("click", () => {
                    const selectedLocation = {
                        lng: place.center_coords[0],
                        lat: place.center_coords[1],
                    };

                    // Center the map on the selected location
                    map.setCenter(selectedLocation);

                    // Optionally, clear existing markers and add a marker for the selected location
                    map.removeObjects(map.getObjects());
                    addMarkerToMap(
                        map,
                        selectedLocation.lat,
                        selectedLocation.lng,
                        placeName
                    );

                    // Update the input field with the selected suggestion
                    areaInput.value = placeName;

                    // Clear the suggestions dropdown
                    clearSuggestions();
                });
            });
        })
        .catch((error) =>
            console.error("Error fetching location suggestions:", error)
        );
}

// Event listener for area input changes
areaInput.addEventListener("input", function () {
    const input = this.value.trim();
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
    const input = this.value.trim();
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
