import express from "express";

import simplify from "@turf/simplify";

const router = express.Router();

const MAPTILER_URL = "https://api.maptiler.com/geocoding";

// https://www.geoapify.com/geojson-javascript-developer-guide

// round to 3 decimal places
const r3 = (num) => Math.round(num * 1000) / 1000;

const getPolyDataForCrime = (feature) => {
    const geometry = feature.geometry;

    // simplify polygons so as to have less coordinates in the post data
    // so there is less chance of erroring due to post data being too large
    // and round the coords for that reason
    if (geometry.type === "Polygon") {
        simplify(geometry, {
            mutate: true,
            tolerance: 0.004,
            highQuality: false,
        });
        // in both cases we only take the first element since its the outer-ring
        // any other elements in the array are inner-rings that subtract from the outer-rind
        return geometry.coordinates[0].map(([lng, lat]) => [r3(lat), r3(lng)]);
    } else if (geometry.type === "MultiPolygon") {
        simplify(geometry, {
            mutate: true,
            tolerance: 0.004,
            highQuality: false,
        });
        // since its multi-polygon it *could* have multiple polygons but in our case
        // of just different locations i cant think of a place that would have multiple
        // polygons, so we just take the first
        return geometry.coordinates[0][0].map(([lng, lat]) => [
            r3(lat),
            r3(lng),
        ]);
    } else {
        // if its anything other than a polygon we just return the center
        // handling all the different cases like lines and multi-lines is too hard for the time being
        return [r3(feature.center[1]), r3(feature.center[0])];
    }
};

router.post("/poly", async (req, res) => {
    try {
        const polyDataRes = await fetch(
            // the URLSearchParams will format the url query parameters automatically
            `${MAPTILER_URL}/${req.body.place_id}.json?` +
                new URLSearchParams({
                    limit: 1,
                    country: "GB",
                    key: process.env.MAPTILER_API_KEY,
                })
        );

        const polyData = await polyDataRes.json();

        res.status(200).json({
            geojson: polyData,
            crimePoly: getPolyDataForCrime(polyData.features[0]),
        });
    } catch (e) {
        console.log(`Failed to get polygon data: ${e}`);

        res.status(403);
    }
});

export default router;
