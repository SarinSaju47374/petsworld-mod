import express from "express";
import {userPymntView} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userPymntView);

export default router;