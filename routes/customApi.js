import express from "express";
import { getUsersV2,getOrdersV2,getSpecificOrder,modifyOrder,getCategories,getSubCategories,getSpecificCategories,modifySpecificCategories,getAllSubCategories} from "../controllers/controllers.js" 
const router = express.Router();
import jwt2 from "jsonwebtoken";
import userModel from "../models/userModel.js";
 

router.get("/users",getUsersV2);
router.get("/orders",getOrdersV2);
router.get("/orders/:oid",getSpecificOrder)
router.get("/categories",getCategories)
router.get("/categories/:id",getSpecificCategories)
router.put("/categories/:id",modifySpecificCategories)
router.get("/subCategories/:cid",getSubCategories)
router.get("/subCategories",getAllSubCategories)
router.post("/orders",modifyOrder);

router.get("/user-coupone",async (req,res)=>{
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
        let userId = jwt2.verify(token, process.env.secretKeyU).user;
        let user = await userModel.findById(userId);
        let currentDate = new Date();
        let coupons = user.coupons.filter(val=>val.expires >= currentDate && val.applied==false);
        res.json(coupons);
    }

})
export default router;