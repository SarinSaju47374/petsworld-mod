import express from "express";
import {userOrderHistView} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userOrderHistView);

export default router;