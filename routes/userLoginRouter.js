import express from "express";
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import jwt2 from 'jsonwebtoken';
const router = express.Router();
import CryptoJS from "crypto-js"
import crypto from "crypto";
import Token from "../models/tokenModel.js";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js"
import sendMail from "../utils/sendMail.js"
import sendOtp from "../utils/sendOtp.js"
// import CryptoJS from "crypto-js"

router.get("/",(req,res)=>{
  res.setHeader('Set-Cookie', 'token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

  res.render("userLogin",{admin:false,user:false,flag:false,unVerif:false});
})

router.post("/", async (req, res) => {
  let {email,psswd} = req.body
 
  if(req.body.lgnBtn=="regular-login"){
    console.log("This is login")
    let user = await userModel.findOne({email:email.trim()});
     console.log(user)
    // let user = users.users.find(d => (CryptoJS.AES.decrypt(d.psswd,process.env.secret_p).toString(CryptoJS.enc.Utf8)==req.body.psswd) && (d.email===req.body.emailMob || d.phoneNumber===Number(req.body.emailMob)))
    
    if (user) {
      console.log("User Exists");

      if (CryptoJS.AES.decrypt(user.psswd, process.env.secret_p).toString(CryptoJS.enc.Utf8) != psswd) {
        console.log("I think password is wrong");
        return res.render("userLogin", { admin: false, user: false, flag: true });
      } else if (!user.verified) {
        let token = await Token.findOne({ userId: user._id });
        console.log("Token Exists");
        
        if (!token) {
          console.log("Token is not there!");
          const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });
          console.log("Token Is Created!");
          const url = `${process.env.BASE_URL}/register/${user._id}/verify/${token.token}`;

          //Send Verification Temporary URL(controlled in DataBase using TTL) Via Email
          await sendMail(user.email,"Verify Email",`Click the link to get Verified ${url}`);
        }
        return  res.render("userLogin", { admin: false, user: false, unVerif: true });
      } else {
        let JWTtoken = jwt2.sign({ user: user._id, exp: Math.floor(Date.now() / 1000) * (60 * 60) }, process.env.secretKeyU);
        const expiration = new Date(new Date().getTime() + 3600000);
        res.set("Set-Cookie", `token=${JWTtoken};httpOnly:false;SameSite=Strict;Expires=${expiration.toUTCString()}`);
      }
    } else {
      return res.render("userLogin", { admin: false, user: false, flag: true });
    }
    res.redirect("/");
  }else{
    console.log("This is otp login")
    let {mob} = req.body;
    let user  = await userModel.findOne({phoneNumber:Number(mob)})
    var randomNumber = Math.floor(Math.random() * 9000) + 1000;

    let secret  = user.email+process.env.SECRET_AUTH;
    try{
    
      console.log(user)
      let payload = {
        id:user._id,
        email:user.email
      }
      const token = jwt2.sign(payload,secret,{expiresIn:'60s'})
      console.log(token)
      const link = `${process.env.BASE_URL}/login/otp/${user._id}/${token}`
      
      //Send the OTP TO MOBILE
      await sendOtp(mob,randomNumber);

      await otpModel.findOneAndUpdate(
        { userId: user._id },
        { otp: Number(randomNumber) },
        { upsert: true }
      );
      res.redirect(link)
    }catch(err){
      console.log("login/forgot err: ",err);
       
    }
    // if(/^\d{10}$/.test(req.body.emailMob)){
    //   console.log("This is a number");
      
    //   var randomNumber = Math.floor(Math.random() * 9000) + 1000;
    //   fetch('http://127.0.0.1:2000/api/users', {
    //   method: 'PUT', // Use the PUT method for updating
    //   headers: {
    //     'Content-Type': 'application/json', // Set the request content type
    //     // Additional headers if required
    //   },
    //   body: JSON.stringify({ 
    //     // Data to be updated
    //      otp:randomNumber,
    //      number:req.body.emailMob
    //   })
    //  })
    //   .then(response => {
    //     // Handle the response
    //     if (response.ok) {
    //       // Value updated successfully
    //       console.log('Value updated successfully');
    //     } else {
    //       // Handle errors
    //       console.error('Error updating value:', response.status);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });

      
    //   // res.render("otpLogin",{admin:false,user:false,number:req.body.emailMob})
    //   // Your AccountSID and Auth Token from console.twilio.com
    //   const accountSid = 'ACfdde94f962631e5d5d57ea933cdf4618';
    //   const authToken = 'ed2ca5ccc281d3c4bc68dd8ba399448f';

      

    //   const client = twilio(accountSid, authToken);

    //   client.messages
    //     .create({
    //       body: ` Your OTP is ${randomNumber}`,
    //       to:  `+91${req.body.emailMob}`, // Text your number
    //       from: '+13157079467', // From a valid Twilio number
    //     })
    //     .then((message) => {
    //       console.log("Message is Succesfully Sent");
    //       res.render("otpLogin",{admin:false,user:false,otp:randomNumber,number:req.body.emailMob})
    //     });
    // }
  }
});


router.get("/otp/:id/:tk",async(req,res)=>{
  const{id,tk} = req.params;
  //Checks the user id is valid or not
  const user = await userModel.findOne({_id:id});
  if(!user) {
    console.log("Invalid Link acessed")
    redirect("/")
  }
  let secret  = user.email+process.env.SECRET_AUTH;
  try{
    const payload = jwt2.verify(tk,secret);
    res.render("otpLogin",{admin:false,user:false,email:payload.email});
  }catch(err){
    console.log("Err: ",err);
    res.redirect("/")
  }
  // res.render("forgotPage2")
})


router.post("/otp/:id/:tk", async (req, res,next) => {
  const { id, tk } = req.params;
  console.log(req.params)
  let { otp } = req.body;
  console.log(req.body)
  let dbOtp = await otpModel.findOne({userId:id});
  let validOtp = dbOtp.otp==otp;
  console.log(validOtp);
  if(validOtp){
    let JWTtoken = jwt2.sign({ user:id, exp: Math.floor(Date.now() / 1000) * (60 * 60) }, process.env.secretKeyU);
    const expiration = new Date(new Date().getTime() + 3600000);
    console.log(JWTtoken);
    res.setHeader("Set-Cookie",`token=${JWTtoken};Path=/;httpOnly:false;SameSite=Strict,Expires=${expiration.toUTCString()}`);
    console.log("res is set*************")
    res.redirect("/");
  }else{
    res.json({"message":"Not a valid OTP"});
  }
  // const encryptedPassword = CryptoJS.AES.encrypt(psswd, process.env.secret_p).toString();
  // const user = await userModel.findOne({ _id: id });
  // if (!user) {
  //   return res.json({ "message": false })
  // };
  // let secret = user.email + process.env.SECRET_AUTH; 
  // try {
  //   const payload = jwt2.verify(tk, secret);
    
  //   await userModel.updateOne({ _id: payload.id }, { psswd:encryptedPassword });
  //   return res.json({ "message": true });
  // } catch (err) {
  //   console.log("Err: ", err);
  //   next();
  // }
});


router.get("/forgot",(req,res)=>{
  res.render("forgotPage1",{admin:false,user:false})
})

router.post("/forgot",async (req,res)=>{
   
  let {email} = req.body;
  let secret  = email+process.env.SECRET_AUTH;
  try{
    let user = await userModel.findOne({email:email});
    let payload = {
      id:user._id,
      email:user.email
    }
    const token = jwt2.sign(payload,secret,{expiresIn:'15m'})
    console.log(token)
    const link = `${process.env.BASE_URL}/login/reset-password/${user._id}/${token}`
    await sendMail(user.email,"Change the Account PassWord",`Click this link to change the password ${link}`);
    res.json({flag:true});

  }catch(err){
    console.log("login/forgot err: ",err);
    res.json({flag:false})
  }
})

router.get("/reset-password/:id/:tk",async(req,res)=>{
  const{id,tk} = req.params;
  //Checks the user id is valid or not
  const user = await userModel.findOne({_id:id});
  if(!user) res.redirect("/")
  let secret  = user.email+process.env.SECRET_AUTH;
  try{
    const payload = jwt2.verify(tk,secret);
    res.render("forgotPage2",{admin:false,user:false,email:payload.email});
  }catch(err){
    console.log("Err: ",err);
    res.redirect("/")
  }
  // res.render("forgotPage2")
})
router.post("/reset-password/:id/:tk", async (req, res,next) => {
  const { id, tk } = req.params;
  let { psswd } = req.body;
  const encryptedPassword = CryptoJS.AES.encrypt(psswd, process.env.secret_p).toString();
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.json({ "message": false })
  };
  let secret = user.email + process.env.SECRET_AUTH; 
  try {
    const payload = jwt2.verify(tk, secret);
    
    await userModel.updateOne({ _id: payload.id }, { psswd:encryptedPassword });
    return res.json({ "message": true });
  } catch (err) {
    console.log("Err: ", err);
    next();
  }
});
export default router;