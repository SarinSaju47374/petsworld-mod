import express from "express";
import {userCheckout} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userCheckout);

export default router;