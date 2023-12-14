import express from "express";
import { adminUserView } from "../controllers/controllers.js";

const router = express.Router();

router.get("/",adminUserView);

// router.post("/",adminProductUpdate);

export default router;