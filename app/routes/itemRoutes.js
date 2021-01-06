import express from "express";
import getUser from "../middlewares/getUserFromJWT";
import { createItem } from "../controllers/itemsController";

const router = express.Router();

router.use("/createItem", getUser);
router.post("/createItem", createItem);

export default router;
