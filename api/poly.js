import express from "express";

const router = express.Router();

const MAPTILER_URL = "https://api.maptiler.com/geocoding";

const getPoly = (place) => {
    if (place.geometry.type === "Polygon") {
        return place.geometry.coordinates[0]; // not sure why there may be more than 1 array of coordinates
    } else if (place.geometry.type === "Point") {
        // just in case use the bounding box of the area if it returns just a single point
        const [minX, minY, maxX, maxY] = place.bbox;

        return [
            [minX, minY],
            [maxX, minY],
            [minX, maxY],
            [maxX, maxY],
        ];
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

        console.log(polyData.features[0].geometry);

        res.status(200).json({
            polygon: getPoly(polyData.features[0]),
        });
    } catch (e) {
        console.log(`Failed to get polygon data: ${e}`);

        res.status(403);
    }
});

export default router;
