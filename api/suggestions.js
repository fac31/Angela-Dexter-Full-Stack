import express from "express";

const router = express.Router();

const MAPTILER_URL = "https://api.maptiler.com/geocoding"; //sdfg.json?proximity=ip&fuzzyMatch=true&limit=3&key=YOUR_MAPTILER_API_KEY_HERE"

const extractSuggestions = (suggestions) => {
    const features = suggestions.features;

    return features.reduce((newFeatures, feature) => {
        newFeatures.push({
            place: {
                name: feature.place_name,
                id: feature.id,
            },
            center: {
                lng: feature.center[0],
                lat: feature.center[1],
            },
        });

        return newFeatures;
    }, []);
};

router.get("/suggestions/:term", async (req, res) => {
    try {
        const suggestionsResp = await fetch(
            // the URLSearchParams will format the url query parameters automatically
            `${MAPTILER_URL}/${req.params.term}.json?` +
                new URLSearchParams({
                    proximity: "ip",
                    fuzzyMatch: true,
                    limit: 5,
                    country: "GB",
                    key: process.env.MAPTILER_API_KEY,
                })
        );

        const suggestions = await suggestionsResp.json();

        res.status(200).json(extractSuggestions(suggestions));
    } catch (e) {
        console.log(`Failed to get suggestions: ${e}`);

        res.status(503).send();
    }
});

export default router;
