import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 3000;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "site"), {}));

// Endpoint for serving HERE API key
app.get('/api/here-api-key', (req, res) => {
    res.json({ apiKey: process.env.HERE_API_KEY });
});


app.get("/suggestions", async (req, res) => {
    try {
        const { query } = req.query;
    } catch (error) {
        console.error("Error fetching location suggestions:", error);
        res.status(500).json({ error: "Failed to fetch location suggestions" });
    }
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
