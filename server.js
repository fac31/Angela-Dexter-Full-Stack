import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import apiRouter from "./api/routes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 3000;

const app = express();

app.use(cors({ origin: ["https://js.api.here.com"] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "site"), {}));

// middleware that provides all the /api endpoints
app.use("/api", apiRouter);

// Fetch crime data from Police API
app.get('/api/crimes-at-location', async (req, res) => {
    const { lat, lng, date } = req.query;
    const url = `https://data.police.uk/api/crimes-at-location?date=${date}&lat=${lat}&lng=${lng}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    res.json(data);
    } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).send('Error fetching crime data');
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
