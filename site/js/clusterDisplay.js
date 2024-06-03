import { addLayer, removeLayer, addBubble } from "./map.js";

function crimeTypeToIcon(crimeType) {
    switch (crimeType) {
        case "anti-social-behaviour":
        case "public-order":
            return "img/crime-asb.svg";

        case "burglary":
            return "img/crime-burglary.svg";
        case "criminal-damage-arson":
            return "img/crime-criminal-damage.svg";
        case "drugs":
            return "img/crime-drugs.svg";
        case "bicycle-theft":
            return "img/crime-bike.svg";

        case "other-theft":
        case "shoplifting":
            return "img/crime-theft.svg";

        case "robbery":
            return "img/crime-robbery.svg";

        case "vehicle-crime":
            return "img/crime-vehicle.svg";

        case "violent-crime":
        case "possession-of-weapons":
            return "img/crime-violence.svg";

        // special case for >3 crimes
        case "rest":
            return "img/icon-rest-crimes.svg";

        default:
            return "img/crime-other.svg";
    }
}

function formatCrimeType(crimeType) {
    switch (crimeType) {
        case "anti-social-behaviour":
            return "Anti-Social Behaviour";
        case "public-order":
            return "Public Order";

        case "burglary":
            return "Burglary";
        case "criminal-damage-arson":
            return "Criminal Damage";
        case "drugs":
            return "Drugs";
        case "bicycle-theft":
            return "Bicycle Theft";

        case "other-theft":
            return "Theft (other)";
        case "shoplifting":
            return "Theft (shoplifting)";

        case "robbery":
            return "Robbery";

        case "vehicle-crime":
            return "Vehicle Crime";

        case "violent-crime":
            return "Violent Crime";
        case "possession-of-weapons":
            return "Violent Crime (possesion of weapons)";

        default:
            return "Other Crime";
    }
}

function markerDomElement(categories) {
    const outerDiv = document.createElement("div");

    let outerDivStyle = `
        background: black;
        border-radius: 15px;
        height: 40px;
        align-items: center;
        justify-content: center;
        object-fit: contain;
        cursor: pointer;
        user-select: none;
        opacity: 70%;
        transition: opacity 0.2s ease-in-out;
    `;

    // apply different styles depending on if there is 1 or more categories
    if (categories.length === 1) {
        outerDivStyle += "display: flex; padding: 5px;";
    } else {
        outerDivStyle += `
            display: grid;
            grid-template-columns: min-content ${"1fr ".repeat(
                categories.length + 1
            )} min-content;
            width: max-content;
            padding: 2px;
        `;
    }

    outerDiv.style = outerDivStyle;
    outerDiv.title = "Click for more detail";

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const icon = document.createElement("img");

        let iconStyle = `
            height: 100%;
            aspect-ratio: 1/1;
            pointer-events: none;
        `;

        if (categories.length > 1) {
            // a grid is used to overlap the different icons
            // there can be up to 4 so these areas put the icons
            // in the correct column
            const gridAreas = [
                "1 / 2 / 2 / 4;",
                "1 / 3 / 2 / 5;",
                "1 / 4 / 2 / 6;",
                "1 / 5 / 2 / 7;",
            ];

            iconStyle += `
                justify-self: center;
                z-index: ${i + 1};
                background: linear-gradient(
                    90deg,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(0, 0, 0, 1) 10%,
                    rgba(0, 0, 0, 1) 100%
                );
                border-radius: 15px;
                grid-area: ${gridAreas[i]}
            `;
        }

        icon.style = iconStyle;
        icon.src = crimeTypeToIcon(category);
        icon.alt = formatCrimeType(category);
        icon.draggable = false;

        outerDiv.appendChild(icon);
    }

    function onHoverStart(evt) {
        evt.target.style.opacity = "100%";
        evt.target.style.zIndex = "999";
    }
    function onHoverEnd(evt) {
        evt.target.style.opacity = "70%";
        evt.target.style.zIndex = "auto";
    }

    return new H.map.DomIcon(outerDiv, {
        onAttach: function (clonedElement, domIcon, domMarker) {
            clonedElement.addEventListener("mouseover", onHoverStart);
            clonedElement.addEventListener("mouseout", onHoverEnd);
        },
        onDetach: function (clonedElement, domIcon, domMarker) {
            clonedElement.removeEventListener("mouseover", onHoverStart);
            clonedElement.removeEventListener("mouseout", onHoverEnd);
        },
    });
}

function getBubbleContent(data) {
    if (data.type === "cluster") {
        // holds all the crimes
        const crimes = [];
        // holds how many times each crime occured
        const crimeTypeCounts = {};

        data.data.forEachDataPoint((p) => {
            const crimeData = p.getData();

            if (crimeTypeCounts[crimeData.category] == null) {
                crimeTypeCounts[crimeData.category] = 1;
            } else {
                crimeTypeCounts[crimeData.category] =
                    crimeTypeCounts[crimeData.category] + 1;
            }

            crimes.push(crimeData);
        });

        // sort the crimes into descending order
        const crimeCountsDescending = Object.keys(crimeTypeCounts).sort(
            (a, b) => crimeTypeCounts[b] - crimeTypeCounts[a]
        );

        return `
            <div class="bubble-container">
                <hgroup>
                    <h1 class="bubble-heading">Crimes In Cluster</h1>
                    <ul class="bubble-list">
                        ${crimeCountsDescending
                            .map(
                                (k) =>
                                    `<li>${formatCrimeType(k)} (<em>x${
                                        crimeTypeCounts[k]
                                    }</em>)</li>`
                            )
                            .join("")}
                    </ul>
                </hgroup>
            </div>
        `;
    } else if (data.type === "single") {
        return `
            <div class="bubble-container">
                <hgroup>
                    <h1 class="bubble-heading">Crime Type</h1>
                    <p class="bubble-para">${formatCrimeType(
                        data.data.category
                    )}</p>
                </hgroup>
                <hgroup>
                    <h1 class="bubble-heading">Crime Outcome</h1>
                    <p class="bubble-para">${
                        data.data.outcome_status?.category ||
                        "<em>No data available</em>"
                    }</p>
                </hgroup>
                <hgroup>
                    <h1 class="bubble-heading">Crime Location</h1>
                    <div class="bubble-location">
                        <p class="bubble-para">
                            ${data.data.location.street.name}
                        </p>
                        <em>
                            ${data.data.location.latitude}, 
                            ${data.data.location.longitude}
                        </em>
                    </div>
                </hgroup>
            </div>
        `;
    }
}

// function crimeToMapsMarker(point, crimeData, isCluster = false) {
//     const markerData = {
//         icon: markerDomElement(crimeData),
//         min: point.getMinZoom(),
//     };

//     if (isCluster) markerData.max = point.getMaxZoom();

//     return new H.map.DomMarker(point.getPosition(), markerData);
// }

function onMarkerClick(e) {
    // Get position of the "clicked" marker
    const position = e.target.getGeometry();
    // Get the data associated with that marker
    const data = e.target.getData();
    // Merge default template with the data and get HTML
    const bubbleContent = getBubbleContent(data);
    let bubble = onMarkerClick.bubble;

    // For all markers create only one bubble, if not created yet
    if (!bubble) {
        bubble = new H.ui.InfoBubble(position, {
            content: bubbleContent,
        });
        addBubble(bubble);
        // Cache the bubble object
        onMarkerClick.bubble = bubble;
    } else {
        // Reuse existing bubble object
        bubble.setPosition(position);
        bubble.setContent(bubbleContent);
        bubble.open();
    }
}

let clusterLayerRef = null;

// Function to process and display crime data on the map
export function clusterCrimeData(data) {
    if (clusterLayerRef) removeLayer(clusterLayerRef);

    const dataPoints = data.map(function (crime) {
        return new H.clustering.DataPoint(
            crime.location.latitude,
            crime.location.longitude,
            null,
            crime
        );
    });

    const clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            // maximum radius of the neighbourhood
            eps: 10,
            // minimum weight of points required to form a cluster
            minWeight: 2,
        },
        theme: CLUSTER_THEME,
    });

    clusteredDataProvider.addEventListener("tap", onMarkerClick);

    const clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    clusterLayerRef = clusteringLayer;

    addLayer(clusteringLayer);
}

// https://stackoverflow.com/questions/65792250/how-to-customize-here-maps-clusters
const CLUSTER_THEME = {
    getClusterPresentation: function (cluster) {
        const allCrimeTypes = new Set();

        // get a set of all the crime types in the cluster
        cluster.forEachDataPoint((p) => {
            const crimeData = p.getData();
            allCrimeTypes.add(crimeData.category);
        });

        // only display 3 of the crime types from the set
        const first3Types = [...allCrimeTypes].slice(0, 3);

        if (allCrimeTypes.size > 3) {
            first3Types.push("rest");
        }

        // Create a marker from a random point in the cluster
        const clusterMarker = new H.map.DomMarker(cluster.getPosition(), {
            icon: markerDomElement(first3Types),
            min: cluster.getMinZoom(),
            max: cluster.getMaxZoom(),
        });

        // Link data from the random point from the cluster to the marker,
        // to make it accessible inside onMarkerClick
        clusterMarker.setData({
            type: "cluster",
            data: cluster,
        });

        return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
        // Get a reference to data object our noise points
        const crimeData = noisePoint.getData();
        // Create a marker for the noisePoint
        const noiseMarker = new H.map.DomMarker(noisePoint.getPosition(), {
            icon: markerDomElement([crimeData.category]),
            min: noisePoint.getMinZoom(),
        });

        // Link a data from the point to the marker
        // to make it accessible inside onMarkerClick
        noiseMarker.setData({
            type: "single",
            data: crimeData,
        });

        return noiseMarker;
    },
};
