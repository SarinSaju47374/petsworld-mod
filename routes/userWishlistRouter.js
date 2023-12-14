import express from "express";
 
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("userWishlist",{admin:false,user:true});
});
 
export default router;