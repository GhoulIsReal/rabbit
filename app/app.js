import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/", itemRoutes);

export { app };
