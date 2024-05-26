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

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
