import express from "express";
import {dogFoodView} from "../controllers/controllers.js";

const router = express.Router();

router.get("/",dogFoodView);

// router.post("/",adminProductUpdate);

export default router;