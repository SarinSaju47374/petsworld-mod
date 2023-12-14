import express from "express";
import {userProductView} from "../controllers/controllers.js";
import userModel from "../models/userModel.js";
import { addressModel,walletModel} from "../models/productModel.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();
import multer from "multer";
const upload = multer({dest: 'views/profiles'})
import fs from "fs";
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
    let id  = jwt2.verify(token,process.env.secretKeyU).user;
    try{
        let user  = await userModel.findById(id);
        let addr = await addressModel.findOne({userId:id,isShippingAddress:true});
        let wallet = await walletModel.findOne({userId:id});
        res.render("userProfile",{admin:false,user:true,user,addr,wallet});
    }catch(err){
        console.log(err);
        res.status(500).json({"message":"Internal server Error"});
    }
    
});

router.post("/photo",upload.single('photo'),async (req,res)=>{
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
 
  // Get the uploaded file from req.file and extract necessary information
  const file = req.file;
  
  if (file) {
    const oldPath = file.path;
    const newPath = `${file.path}.png`;

    if (fs.existsSync(oldPath)) {
      fs.rename(oldPath, newPath, function(err) {
        if (err) throw err;
        console.log('File renamed successfully');
      });
    } else {
      console.log('File does not exist at the old path:', oldPath);
    }
  
    const photo = JSON.stringify({
        title: file.originalname,
        filepath: newPath.replace(/views/gi,""),
      });
    await userModel.updateOne({_id:id},{
        photo
    });
    console.log("Successfully Profile added to Users DataBase");
    res.json({"success":true});
  } else {
    console.log("No photo uploaded");
    res.status(400).send("No photo uploaded");
  }
}
})
export default router;