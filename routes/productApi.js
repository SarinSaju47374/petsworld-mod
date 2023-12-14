import express from "express";
import {getProducts,updateProductsApi} from "../controllers/controllers.js"
import { productModel } from "../models/productModel.js";

const router = express.Router();

router.get("/products",getProducts);
router.get("/products/:id",async (req,res)=>{
    let data  = await productModel.find({_id:req.params.id}).populate("category", "name").populate("subCategory", "name") 
    res.json(data);
})
 
router.put("/products/:id",updateProductsApi)

export default router;