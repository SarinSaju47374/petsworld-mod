import express from "express";
import { walletModel } from "../models/productModel.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",async (req,res)=>{
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

  if (token) {
    const secretKey = process.env.secretKeyU;
    const decodedToken = jwt2.verify(token, secretKey);
    const id = decodedToken.user;
    let walletData = await walletModel.findOne({userId:id}).populate('transactions');
    
    res.render("userWalletHistory",{admin:false,user:true,loggedIn:true,hist:walletData.transactions.sort((a, b) => b.date - a.date)})
  }
});

export default router;