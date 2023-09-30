import express from "express";
import { getUser, saveUser } from "./controller.js";
const router = express.Router();


router.get("/get/:id", getUser);
router.post("/save", saveUser);

export default router;