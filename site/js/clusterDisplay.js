import { addLayer, removeLayer } from "./map.js";

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

function markerDomElement(crimeData) {
    const outerDiv = document.createElement("div");
    const icon = document.createElement("img");

    outerDiv.style = `
background: black;
border-radius: 15px;
width: 40px;
height: 40px;
padding: 5px;
display: flex;
justify-content: center;
align-items: center;
object-fit: contain;
cursor: pointer;
user-select: none;
opacity: 80%;
    `;

    icon.style = `width: 100%; height: 100%; aspect-ratio: 1/1`;
    icon.src = crimeTypeToIcon(crimeData.category);
    icon.alt = formatCrimeType(crimeData.category);
    icon.draggable = false;

    outerDiv.title = formatCrimeType(crimeData.category);

    outerDiv.appendChild(icon);

    return outerDiv;
}

function crimeToMapsMarker(point, crimeData, isCluster = false) {
    const markerData = {
        icon: new H.map.DomIcon(markerDomElement(crimeData)),
        min: point.getMinZoom(),
    };

    if (isCluster) markerData.max = point.getMaxZoom();

    return new H.map.DomMarker(point.getPosition(), markerData);
}

let clusterLayerRef = null;

// Function to process and display crime data on the map
export function clusterCrimeData(data) {
    if (clusterLayerRef) removeLayer(clusterLayerRef);

    console.log(data.length);

    let dataPoints = data.map(function (crime) {
        return new H.clustering.DataPoint(
            crime.location.latitude,
            crime.location.longitude,
            null,
            crime
        );
    });

    let clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            // maximum radius of the neighbourhood
            eps: 10,
            // minimum weight of points required to form a cluster
            minWeight: 2,
        },
        theme: CLUSTER_THEME,
    });

    let clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    clusterLayerRef = clusteringLayer;

    addLayer(clusteringLayer);
}

// https://stackoverflow.com/questions/65792250/how-to-customize-here-maps-clusters
const CLUSTER_THEME = {
    getClusterPresentation: function (cluster) {
        // Get random DataPoint from our cluster
        let randomDataPoint = getRandomDataPoint(cluster),
            // Get a reference to data object that DataPoint holds
            data = randomDataPoint.getData();

        // Create a marker from a random point in the cluster
        let clusterMarker = crimeToMapsMarker(cluster, data, true);

        // Link data from the random point from the cluster to the marker,
        // to make it accessible inside onMarkerClick
        clusterMarker.setData(data);

        return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
        // Get a reference to data object our noise points
        let data = noisePoint.getData(),
            // Create a marker for the noisePoint
            noiseMarker = crimeToMapsMarker(noisePoint, data);

        // Link a data from the point to the marker
        // to make it accessible inside onMarkerClick
        noiseMarker.setData(data);

        return noiseMarker;
    },
};

function getRandomDataPoint(cluster) {
    var dataPoints = [];

    // Iterate through all points which fall into the cluster and store references to them
    cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));

    // Randomly pick an index from [0, dataPoints.length) range
    // Note how we use bitwise OR ("|") operator for that instead of Math.floor
    return dataPoints[(Math.random() * dataPoints.length) | 0];
}
