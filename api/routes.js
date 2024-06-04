import express from "express";

// API functions
import suggestions from "./suggestions.js";
import crimeRouter from "./crimes.js";
// import poly from "./poly.js";

const router = express.Router();

// this router defines the individual endpoints
// so this would be /api/suggestions
router.get("/suggestions/:term", suggestions);
router.use("/crime", crimeRouter);

export default router;