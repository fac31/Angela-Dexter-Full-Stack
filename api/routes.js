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
// router.use("/crimes", crimeRouter);
// router.post("/poly", poly);
// New route to handle queries with the parameter "search"
// router.get("/search", (req, res) => {
//     const searchTerm = req.query.search;
//     // Handle the search term, perform operations, and send response
//     res.send(`Received search term: ${searchTerm}`);
// });

export default router;