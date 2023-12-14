import express from "express";
import {userCartView,prodCheckout,cartCheckout,cartPymntInit,cartPay,orderInvoice,orderStatus,orderCancel,orderReturn,verifyPymnt,orderCouponStatus} from "../controllers/controllers.js";
import jwt2 from "jsonwebtoken";
const router = express.Router();

router.get("/",userCartView);   
router.post("/")
router.get("/checkout/item/:iid",prodCheckout);
router.get("/checkout",cartCheckout);
router.get("/pymnt/:idType/:id",cartPymntInit)
router.post("/pymnt2/chkout/:idType/:id/:coupon?",cartPay)
router.post("/pymnt/verify",verifyPymnt)
router.get("/order/:id/:coupon?",orderInvoice);
router.get("/order2/real-time/:id",orderStatus);
router.post("/order/cancel",orderCancel);
router.post("/order/returnOrdr",orderReturn);
router.get("/order/couponStatus/:id",orderCouponStatus)
export default router;