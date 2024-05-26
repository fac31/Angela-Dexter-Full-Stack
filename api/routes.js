import express from "express";

// API functions
import suggestions from "./suggestions.js";
import key from "./key.js";

const router = express.Router();

// this router defines the individual endpoints
// so this would be /api/suggestions
router.get("/suggestions/:term", suggestions);
router.get("/here-api-key", key);

export default router;
