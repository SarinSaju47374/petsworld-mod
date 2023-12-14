import express from "express";
import {getUsers,getUserAddress,getUserDetails,updateUserDetails} from "../controllers/controllers.js"
import userModel from "../models/userModel.js";
import { addressModel } from "../models/productModel.js";
const router = express.Router();
import mongoose from "mongoose";
import jwt2 from "jsonwebtoken";
const ObjectId = mongoose.Types.ObjectId;

router.get("/users",getUsers);
router.get("/users/addr/:id",getUserAddress);
router.get("/users/:tk",getUserDetails)
router.post("/users/update/:tk",updateUserDetails)
router.put("/users",async(req,res)=>{
    try{
        await userModel.updateOne({phoneNumber:req.body.number},{otp:req.body.otp});
    }catch(error){
        console.log(error);
    }    
})
// Select address
// Select address
router.post('/users/addr/select/:addrId', async (req, res) => {
    const { addrId } = req.params;
  
    try {
      // Set all addresses' isShippingAddress to false
      await addressModel.updateMany({}, { $set: { isShippingAddress: false } });
  
      // Set the selected address's isShippingAddress to true
      await addressModel.updateOne({ _id: addrId }, { $set: { isShippingAddress: true } });
  
      // Get the updated user document
    //   const user = await userModel.findById(req.user._id);
  
      res.json({ message: 'Address selected successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  
  
  
  // Delete address
  router.delete('/users/addr/delete/:addrId', async (req, res) => {
    const { addrId } = req.params;
    let userId;
    //cookie extraction
    let cookieHeaderValue = req.headers.cookie;
    let token = null;

    if (cookieHeaderValue) {
      let cookies = cookieHeaderValue.split(";");

      for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.trim().split("=");

        if (cookieName === "token") {
          token = cookieValue;
          break;
        }
      }
    }
    //cookie extraction

    if(token){
      userId = jwt2.verify(token,process.env.secretkeyU).user;
    }
    try {
      // Remove the address from the address collection
      await addressModel.findByIdAndDelete(addrId);
      // Remove the address from the user's addresses array
      await userModel.updateOne({_id:userId}, { $pull: { addresses:{ addrId: addrId } } });
      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
export default router;