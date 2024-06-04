import express from "express";

const router = express.Router();

const CRIME_DATA_URL = "https://data.police.uk/api";

const formatPoly = (poly) => {
    return poly.map((pair) => `${pair[0]},${pair[1]}`).join(":");
};

router.get("/last-updated", async (req, res) => {
    try {
        const lastUpdatedRes = await fetch(
            `${CRIME_DATA_URL}/crime-last-updated`
        );
        const lastUpdated = await lastUpdatedRes.json();

        const year = parseInt(lastUpdated.date.substring(0, 4));
        const month = parseInt(lastUpdated.date.substring(6, 7));

        res.status(200).json({
            dateString: `${year}-${month >= 10 ? "" : "0"}${month}`,
            year,
            month,
        });
    } catch (e) {
        console.log(`Failed to get crime last-updated: ${e}\n${e.stack}`);

        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 2;

        // handle january/february
        if (month === -1) {
            year--;
            month = 11;
        } else if (month === 0) {
            year--;
            month = 12;
        }

        res.status(200).json({
            dateString: `${year}-${month >= 10 ? "" : "0"}${month}`,
            month,
            year,
        });
    }
});

router.post("/location", async (req, res) => {
    // console.log(req.body);
    // console.log(
    //     `${CRIME_DATA_URL}/crimes-street/${req.body.crime_type}?` +
    //         new URLSearchParams({
    //             poly: formatPoly(req.body.polygon),
    //             date: req.body.date,
    //             // lat: req.body.lat,
    //             // lng: req.body.lng,
    //         })
    // );
    try {
        const crimeData = await fetch(
            `${CRIME_DATA_URL}/crimes-street/all-crime?` +
                new URLSearchParams({
                    poly: formatPoly(req.body.polygon),
                    date: req.body.date,
                    // lat: req.body.lat,
                    // lng: req.body.lng,
                })
        );

        if (crimeData.status !== 200) {
            res.status(503).send();
            return;
        }

        const crimes = await crimeData.json();

        res.status(200).json(crimes);
    } catch (e) {
        console.log(`Failed to get crimes: ${e}\n${e.stack}`);

        res.status(503);
    }
});

// Define the route handler for /api/crimes
router.get("/crimes", (req, res) => {
    // Extract the search query parameter from the request
    const searchQuery = req.query.search;

    // Query the data source based on the search query
    const filteredCrimes = crimeData.filter((crime) => {
        // Perform any filtering logic based on the search query
        // For example, filter crimes by a certain category or location
        return crime.category.includes(searchQuery); // Example filtering by crime category
    });

    // Send the filtered crimes back as the response
    res.json(filteredCrimes);
});

export default router;
