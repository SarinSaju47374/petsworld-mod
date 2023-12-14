import express from "express";
import { adminCtgryView ,ctgryUpdate} from "../controllers/controllers.js";

const router = express.Router();

router.get("/",adminCtgryView);

router.post("/",ctgryUpdate);

export default router;