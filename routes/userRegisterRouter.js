import express from "express";
import {addUser, resendMail,verifyToken} from "../controllers/controllers.js"
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("userRegister");
})

router.post("/",addUser);
// router.post("/:id",resendMail)
router.put("/",resendMail);
router.get("/verify/:id",(req,res)=>{
    
    console.log(req.params.id);
    // delete req.session.data;
    res.render("resendMail",{admin:false,user:false,id:req.params.id})
})

router.get("/:id/verify/:token",verifyToken)
// router.get("/user-verified",(req,res)=>{
//     res.render("emailVerified",{admin:false,user:false});
// })


export default router;
