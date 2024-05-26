import express from "express";

// API functions
import suggestions from "./suggestions.js";

const router = express.Router();

// this router defines the individual endpoints
// so this would be /api/suggestions
router.get("/suggestions/:term", suggestions);

export default router;
