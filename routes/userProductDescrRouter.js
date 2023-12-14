import express from "express";
import {userProductDescr} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userProductDescr);

// router.post("/",async(req,res)=>{ 
 
// //    Retrieve the stored OTP from the database or session based on the user or form submission
//    const enteredOTP = Number(req.body.otp);
//    const dataD = await fetch("http://127.0.0.1:2000/users");
//    const data = await dataD.json();
//    console.log("data: ",data);
//    console.log("ph: ",req.body.phone);
//    console.log("otp: ",req.body.otp);
//    let user = data.find(user=>user.phoneNumber===Number(req.body.phone));
//    console.log("user: ",user);
//    if(user.otp && user.otp===enteredOTP){
//      console.log("You entered the right OTP");
//      let JWTtoken = jwt2.sign({user:user.userName,exp:Math.floor(Date.now()/1000)*(60*60)},process.env.secretKeyU);
//      const expiration = new Date(new Date().getTime()+3600000);
//      res.set("Set-Cookie",`token=${JWTtoken};httpOnly;Expiration=${expiration.toUTCString()}`);
//      res.redirect("/landing-page");
//    }else{
//      console.log("You entered wrong OTP");
//      res.redirect("/login");
//    }
   
// });

export default router;