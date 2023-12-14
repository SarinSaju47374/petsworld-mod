import express from "express";
import {userAddressView} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userAddressView);

export default router;