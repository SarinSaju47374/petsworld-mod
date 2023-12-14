import express from "express";
import {adminLogin,adminVerify} from "../controllers/controllers.js";

const router = express.Router();

router.get("/",adminLogin);


router.post("/",adminVerify);

export default router;