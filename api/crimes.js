import express from "express";

const router = express.Router();

const CRIME_DATA_URL = "https://data.police.uk/api";

const formatPoly = (poly) => {
    return poly.map((pair) => `${pair.lat},${pair.lng}`).join(":");
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
    //             //poly: formatPoly(req.body.polygon),
    //             date: req.body.date,
    //             lat: req.body.lat,
    //             lng: req.body.lng,
    //         })
    // );
    try {
        const crimeData = await fetch(
            `${CRIME_DATA_URL}/crimes-street/${req.body.crime_type}?` +
                new URLSearchParams({
                    //poly: formatPoly(req.body.polygon),
                    date: req.body.date,
                    lat: req.body.lat,
                    lng: req.body.lng,
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
