import express from "express";
import {addressModel} from "../models/productModel.js";
import {handleAddr} from "../controllers/controllers.js"
import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
const router = express.Router();
router.post("/handleAddr/:opt/:tk",handleAddr)

export default router;