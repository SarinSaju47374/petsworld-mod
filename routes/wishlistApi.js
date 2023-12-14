import express from "express";
import {wishlistModel} from "../models/productModel.js";
import {addToWishlist,getWishlist,removeFromWishlist} from "../controllers/controllers.js"
 
const router = express.Router();

router.get("/wishlistData",getWishlist);
 
router.get('/deleteWishlistItem',removeFromWishlist)

router.get("/wishlist",addToWishlist);

export default router;