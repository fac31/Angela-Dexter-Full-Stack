import express from "express";

const router = express.Router();

router.get("/here-api-key", async (req, res) => {
    res.json({ apiKey: process.env.HERE_API_KEY });
});

export default router;
