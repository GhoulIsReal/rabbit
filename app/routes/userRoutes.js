import express from "express";

import { createUser, siginUser } from "../controllers/usersController";

const router = express.Router();

router.post("/register", createUser);
router.post("/signin", siginUser);
export default router;