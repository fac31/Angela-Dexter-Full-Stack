import { addLayer, removeLayer } from "./map.js";

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

    console.log("1");

    let clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            // maximum radius of the neighbourhood
            eps: 10,
            // minimum weight of points required to form a cluster
            minWeight: 2,
        },
        theme: CLUSTER_THEME,
    });

    console.log("2");

    let clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    clusterLayerRef = clusteringLayer;

    console.log(clusteringLayer);

    addLayer(clusteringLayer);
}

// https://stackoverflow.com/questions/65792250/how-to-customize-here-maps-clusters
const CLUSTER_THEME = {
    getClusterPresentation: function (cluster) {
        // Get random DataPoint from our cluster
        let randomDataPoint = getRandomDataPoint(cluster),
            // Get a reference to data object that DataPoint holds
            data = randomDataPoint.getData();

        console.log(data);

        // Create a marker from a random point in the cluster
        let clusterMarker = new H.map.Marker(cluster.getPosition(), {
            icon: new H.map.Icon(
                "//upload.wikimedia.org/wikipedia/commons/thumb/3/3b/11-09-fotofluege-cux-allg-25a.jpg/120px-11-09-fotofluege-cux-allg-25a.jpg",
                {
                    size: { w: 50, h: 50 },
                    anchor: { x: 25, y: 25 },
                }
            ),

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
                // Use min zoom from a noise point
                // to show it correctly at certain zoom levels:
                min: noisePoint.getMinZoom(),
                icon: new H.map.Icon(data.thumbnail, {
                    size: { w: 20, h: 20 },
                    anchor: { x: 10, y: 10 },
                }),
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
