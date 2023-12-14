import express from "express";
import {productAdd} from "../controllers/controllers.js";
import multer from "multer";
import { productModel } from "../models/productModel.js";


const router = express.Router();

router.get("/",productAdd);
router.use(express.json());

const upload = multer({ dest: 'views/uploads/' });
router.post("/",upload.array('photos'),async(req,res)=>{
    let oid = req.query.oid;
     const{
        productName,
        description,
        points,
        productPrice,
        discount,
        stock,
        category,
        subCategory,
        paymentOption,
        rating,
     } = req.body;
       
    let salePrice = (productPrice-productPrice*Number(discount)/100);
    await productModel.updateOne({_id:},{
        productName:productName,
        description:description,
        points:points.split(","),
        productPrice:productPrice,
        salePrice:salePrice,
        stock:stock,
        category:category,
        subCategory:subCategory,
        paymentOption:paymentOption,
        rating:rating,
    })
     
    res.send("Sucess");
})

export default router;