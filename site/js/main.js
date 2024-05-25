document.addEventListener('DOMContentLoaded', async function () {
    const viewDefinitionsBtn = document.getElementById('viewDefinitions');
    viewDefinitionsBtn.addEventListener('click', function () {
        alert('Crime definitions go here.');
    });

    // Fetch HERE API key from the server
    const hereApiKey = await fetch('/api/here-api-key')
        .then(response => response.json())
        .then(data => data.apiKey)
        .catch(error => {
            console.error('Error fetching HERE API key:', error);
        });

    if (!hereApiKey) {
        console.error('HERE API key is missing');
        return;
    }

    const latitude = 51.5074; // Coordinates for London
    const longitude = -0.1278;
    const radius = 1000; // in meters
    const date = '2024-05-01';

    // Initialize HERE Map
    const platform = new H.service.Platform({
        'apikey': hereApiKey
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
            center: { lat: latitude, lng: longitude },
            zoom: 10,
            pixelRatio: window.devicePixelRatio || 1
        }
    );

    window.addEventListener('resize', () => map.getViewPort().resize());

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Function to add a marker to the map
    function addMarkerToMap(map, lat, lng, data) {
        const marker = new H.map.Marker({ lat, lng });
        marker.setData(data);
        map.addObject(marker);
    }

    // Function to fetch crime data from the HERE API
    function fetchHereCrimeData() {
        const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${latitude},${longitude}&q=${input}&apikey=${hereApiKey}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    function fetchPoliceCrimeData(latitude, longitude, date) {
        const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${date}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }   

    // Function to process and display crime data on the map
    function processCrimeData(data) {
        data.forEach(crime => {
            addMarkerToMap(map, crime.lat, crime.lng, `${crime.type}: ${crime.count}`);
        });
    }

    // Combined function to fetch and process crime data from both APIs
    async function fetchAndProcessCrimeData() {
        try {
            const [hereCrimeData, policeCrimeData] = await Promise.all([
                fetchHereCrimeData(hereApiKey, latitude, longitude, radius), // Pass hereApiKey, latitude, longitude, and radius
                fetchPoliceCrimeData(latitude, longitude, date)
            ]);

            // Process the responses and update the map accordingly
            processCrimeData(hereCrimeData.incidents);
            processCrimeData(policeCrimeData);
        } catch (error) {
            console.error('Error fetching crime data:', error);
        }
    }

    // Fetch and process crime data from both APIs
    fetchAndProcessCrimeData();
    
    const areaInput = document.getElementById('area');
    const areaSuggestions = document.getElementById('areaSuggestions');
    

    // Function to fetch location suggestions based on input
function fetchLocationSuggestions(input, hereApiKey) {
    const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${latitude},${longitude}&q=${input}&apikey=${hereApiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging console log
            areaSuggestions.innerHTML = '';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.address.label;
                areaSuggestions.appendChild(li);

                // Add click event to fill input with selected suggestion
                li.addEventListener('click', () => {
                    const selectedLocation = {
                        lat: item.position.lat,
                        lng: item.position.lng  
                    };

                    // Center the map on the selected location
                    map.setCenter(selectedLocation);

                    // Optionally, clear existing markers and add a marker for the selected location
                    map.removeObjects(map.getObjects());
                    addMarkerToMap(map, selectedLocation.lat, selectedLocation.lng, item.address.label);

                    // Update the input field with the selected suggestion
                    areaInput.value = item.address.label;

                    // Clear the suggestions dropdown
                    areaSuggestions.innerHTML = '';
                });
            });
        })
        .catch(error => console.error('Error fetching location suggestions:', error));
}


    // Event listener for area input changes
    areaInput.addEventListener('input', function () {
        const input = this.value.trim();
        if (input.length > 2) { // Fetch suggestions only if input length is greater than 2
            fetchLocationSuggestions(input, hereApiKey);
        } else {
            areaSuggestions.innerHTML = ''; // Clear suggestions if input length is less than 2
        }
    });

    // Hide suggestions when clicking outside the input field
    document.addEventListener('click', (e) => {
        if (!areaInput.contains(e.target) && !areaSuggestions.contains(e.target)) {
            areaSuggestions.innerHTML = '';
        }
    });
});

