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
    //     `${CRIME_DATA_URL}/crimes-street/all-crime?` +
    //         new URLSearchParams({
    //             poly: formatPoly(req.body.polygon),
    //             date: req.body.date,
    //             // lat: req.body.lat,
    //             // lng: req.body.lng,
    //         })
    // );
    // console.log(req.body.polygon);

    try {
        let crimeData;

        if (req.body.polygon.type === "poly") {
            crimeData = await fetch(
                `${CRIME_DATA_URL}/crimes-street/all-crime?` +
                    new URLSearchParams({
                        poly: formatPoly(req.body.polygon.data),
                        date: req.body.date,
                    })
            );
        } else {
            crimeData = await fetch(
                `${CRIME_DATA_URL}/crimes-street/all-crime?` +
                    new URLSearchParams({
                        date: req.body.date,
                        lat: req.body.polygon.data[0],
                        lng: req.body.polygon.data[1],
                    })
            );
        }

        if (crimeData.status !== 200) {
            res.status(503).send();
            return;
        }

        const crimes = await crimeData.json();

        res.status(200).json(crimes);
    } catch (e) {
        console.log(`Failed to get crimes: ${e}\n${e.stack}`);

        res.status(503).send();
    }
});

router.get("/outcome/:crimeId", async (req, res) => {
    try {
        const outcomeResp = await fetch(
            `${CRIME_DATA_URL}/outcomes-for-crime/${req.params.crimeId}`
        );

        const outcome = await outcomeResp.json();

        res.status(200).json(outcome.outcomes);
    } catch (e) {
        console.log(`Failed to get crime outcome: ${e}\n${e.stack}`);

        res.status(503).send();
    }
});

export default router;
