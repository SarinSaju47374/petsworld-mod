import express from "express";
import {couponModel} from "../models/productModel.js";
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";
const router = express.Router();
 
router.get("/coupon-admin",(req,res)=>{
    res.render("adminCoupons",{admin:true,user:false})
})
router.post("/coupon-admin",async(req,res)=>{
    let {
        coupon,
        discount,
        minPrice,
    } = req.body
    let currentDate  = new Date()
    let expiration = currentDate.setSeconds(currentDate.getSeconds()+3600);
    try{
        let couponData = await couponModel.create({
            coupon:coupon.toUpperCase(),
            discount:discount,
            minPrice:minPrice,
            expires:expiration,
        })
        res.json(couponData);
    }catch(err){
        console.log("The error inside the POST of coupon-admin",err)
    }
})
router.get("/coupons-data",async(req,res)=>{
  
    try{
        let couponData = await couponModel.find();
        
        res.json(couponData);
    }catch(err){
        console.log("The error inside the POST of coupon-admin",err)
    }
})
router.get("/coupons-data/:id",async(req,res)=>{
  
    try{
        await couponModel.deleteOne({_id:req.params.id});
        res.json({"deleted":true});
    }catch(err){
        console.log("The error inside the POST of coupon-admin",err)
    }
})


export default router;
