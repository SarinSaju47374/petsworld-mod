import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{
    res.render("productMngmt",{admin:true,user:false});
})

export default router;