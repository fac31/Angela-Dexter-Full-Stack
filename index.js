import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "site/"), {}));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
