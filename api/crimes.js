import express from "express";

const router = express.Router();

const CRIME_DATA_URL = "https://data.police.uk/api/";

const formatPoly = (poly) => {
    return poly.map((pair) => `${pair.lat},${pair.lng}`).join(":");
};

router.get("/last-updated", async (req, res) => {
    try {
        const lastUpdatedRes = await fetch(
            `${CRIME_DATA_URL}/crime-last-updated`
        );
        const lastUpdated = await lastUpdatedRes.json();

        res.status(200).json({ date: lastUpdated.date.substring(0, 7) });
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
            date: `${year}-${month >= 10 ? "" : "0"}${month}`,
        });
    }
});

router.post("/location", async (req, res) => {
    // console.log(
    //     `${CRIME_DATA_URL}/${req.body.crime_type}?` +
    //         new URLSearchParams({
    //             //poly: formatPoly(req.body.polygon),
    //             date: req.body.date,
    //             lat: 51.5286417,
    //             lng: -0.1057185,
    //         })
    // );
    try {
        const crimeData = await fetch(
            `${CRIME_DATA_URL}/crimes-street/${req.body.crime_type}?` +
                new URLSearchParams({
                    //poly: formatPoly(req.body.polygon),
                    date: req.body.date,
                    lat: 51.5286417,
                    lng: -0.1057185,
                })
        );

        const crimes = await crimeData.json();

        res.status(200).json(crimes);
    } catch (e) {
        console.log(`Failed to get crimes: ${e}\n${e.stack}`);

        res.status(403);
    }
});

export default router;
