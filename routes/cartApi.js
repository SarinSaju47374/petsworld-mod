import express from "express";
import {cartModel} from "../models/productModel.js";
import {getCart,addToCart} from "../controllers/controllers.js"
// import userModel from "../models/userModel.js";
const router = express.Router();

router.get("/cart/:id",getCart);
// router.put("/users",async(req,res)=>{
//     try{
//         await userModel.updateOne({phoneNumber:req.body.number},{otp:req.body.otp});
//     }catch(error){
//         console.log(error);
//     }    
// })
// Update the route
router.post('/deleteCart',async(req,res)=>{
  const {itemId} = req.body;
  try{
    const updatedCart = await cartModel.findOneAndUpdate(
      { 'items._id': itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    res.json({ success: true, cart: updatedCart });
  }catch(err){
    console.log("Error: ",err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/updateCart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await cartModel.findOneAndUpdate(
      { 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    ).populate('items.productId');

    // Calculate the updated total for the specific product
    const updatedProduct = updatedCart.items.find(item => item.productId._id.toString() === productId);
    const total = updatedProduct.productId.salePrice * updatedProduct.quantity;

    res.json({ success: true, total });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get("/cart",addToCart);

export default router;