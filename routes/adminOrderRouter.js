import express from "express";
 import {adminOrderInvoice} from "../controllers/controllers.js";

const router = express.Router();

router.get("/orders",(req,res)=>{
    res.render("adminOrderView",{admin:true,user:false});
});
router.get("/orders/:id",adminOrderInvoice);
// router.post("/",adminProductUpdate);

export default router;