import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cartModel } from "../models/productModel.js";
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

router.get("/cartNumber/:tk", async (req, res) => {
    let { tk } = req.params;
    let totalQuantity;
    try {
      let id = jwt.verify(tk, process.env.secretKeyU).user;
      console.log(id);
      const cart = await cartModel.findOne({ userId: new ObjectId(id) });
      if (cart) {
        totalQuantity = cart.items.reduce((accumulator, item) => {
          return accumulator + item.quantity;
        }, 0);
      } else {
        totalQuantity = 0;
      }
  
      console.log(totalQuantity);
      res.json({ qnty: totalQuantity });
    } catch (err) {
      console.log("Err: ", err);
      res.json({ qnty: null });
    }
  });
  

export default router;
