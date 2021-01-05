import express from "express";

import { createItem } from "../controllers/itemsController";

const router = express.Router();

router.post("/createItem", createItem);
export default router;
