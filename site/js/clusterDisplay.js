import { addLayer, removeLayer } from "./map.js";

function crimeToIcon(crimeType) {
    switch (crimeType) {
        case "all-crime":
            return "img/crime-other.svg";

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

function crimeToMapsIcon(crimeType) {
    return new H.map.Icon(crimeToIcon(crimeType), {
        size: { w: 35, h: 35 },
        anchor: { x: 25, y: 25 },
    });
}

let clusterLayerRef = null;

// Function to process and display crime data on the map
export function clusterCrimeData(data) {
    if (clusterLayerRef) removeLayer(clusterLayerRef);

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
        let clusterMarker = new H.map.Marker(cluster.getPosition(), {
            icon: crimeToMapsIcon(data.category),

            // Set min/max zoom with values from the cluster,
            // otherwise clusters will be shown at all zoom levels:
            min: cluster.getMinZoom(),
            max: cluster.getMaxZoom(),
        });

        // Link data from the random point from the cluster to the marker,
        // to make it accessible inside onMarkerClick
        clusterMarker.setData(data);

        return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
        // Get a reference to data object our noise points
        let data = noisePoint.getData(),
            // Create a marker for the noisePoint
            noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                icon: crimeToMapsIcon(data.category),
                // Use min zoom from a noise point
                // to show it correctly at certain zoom levels:
                min: noisePoint.getMinZoom(),
            });

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
