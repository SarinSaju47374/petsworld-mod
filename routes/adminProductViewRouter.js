import express from "express";
import { adminProductView,adminProductUpdate } from "../controllers/controllers.js";

const router = express.Router();

router.get("/",adminProductView);

router.post("/",adminProductUpdate);

export default router;