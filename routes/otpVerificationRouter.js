import express from "express";
import { } from "../controllers/controllers.js";

const router = express.Router();

// router.get("/");


router.post("/",adminVerify);

export default router;