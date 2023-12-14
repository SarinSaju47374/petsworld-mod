import express from "express";
import {} from "../controllers/controllers.js";
import  moment from "moment";
import {orderModel,ctgryModel,productModel} from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { startOfDay, subDays, format } from 'date-fns';

const router = express.Router();

router.get("/dashboard",(req,res)=>{
    res.render("adminDashboard",{admin:true,user:false});
});
 

// router.get('/sales', async (req, res) => {
//     try {
//       // Calculate weekly sales
//       const startOfWeek = moment().startOf('week').toDate();
//       const endOfWeek = moment().endOf('week').toDate();
  
//       const weeklySalesResult = await orderModel.aggregate([
//         {
//           $match: {
//             $and: [
//               { 'products.orderDelivered': { $gte: startOfWeek, $lte: endOfWeek } },
//               { paymentmode: { $in: ['online', 'order-delivered'] } }
//             ]
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             weeklySales: { $sum: { $toDouble: '$totalPrice' } }
//           }
//         }
//       ]).exec();
  
//       const weeklySales = weeklySalesResult[0] ? weeklySalesResult[0].weeklySales : 0;
  
//       // Calculate monthly sales
//       const startOfMonth = moment().startOf('month').toDate();
//       const endOfMonth = moment().endOf('month').toDate();
  
//       const monthlySalesResult = await orderModel.aggregate([
//         {
//           $match: {
//             $and: [
//               { 'products.orderDelivered': { $gte: startOfMonth, $lte: endOfMonth } },
//               { paymentmode: { $in: ['online', 'order-delivered'] } }
//             ]
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             monthlySales: { $sum: { $toDouble: '$totalPrice' } }
//           }
//         }
//       ]).exec();
  
//       const monthlySales = monthlySalesResult[0] ? monthlySalesResult[0].monthlySales : 0;
  
//       // Calculate yearly sales
//       const startOfYear = moment().startOf('year').toDate();
//       const endOfYear = moment().endOf('year').toDate();
  
//       const yearlySalesResult = await orderModel.aggregate([
//         {
//           $match: {
//             $and: [
//               { 'products.orderDelivered': { $gte: startOfYear, $lte: endOfYear } },
//               { paymentmode: { $in: ['online', 'order-delivered'] } }
//             ]
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             yearlySales: { $sum: { $toDouble: '$totalPrice' } }
//           }
//         }
//       ]).exec();
  
//       const yearlySales = yearlySalesResult[0] ? yearlySalesResult[0].yearlySales : 0;
  
//       const salesData = {
//         weeklySales,
//         monthlySales,
//         yearlySales
//       };
  
//       res.json(salesData);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     }
//   });
router.get('/sales',async (res,req)=>{
  

})

router.get('/data',async(req,res)=>{
    let users = await userModel.countDocuments();
    let products =await productModel.countDocuments();
    let categories = await ctgryModel.countDocuments();
    const order = await orderModel.find().populate('products.productId')
  
      let total =0;
      let cod =0;
      let online = 0;
      let placed=0;
      let cancelled=0;
      order.forEach(val=>{
        if(val.paymentmode=="cod"){
          cod+=1;
        }else{
          online+=1;
        }
        val.products.map((pr)=>{
          if(pr.status=="orderDelivered"){
            placed+=1;
            total+=Number((pr.productId.salePrice*pr.quantity))
          }else if((val.paymentmode=="online" && pr.status!="orderCancelled")){
            total+=Number((pr.productId.salePrice*pr.quantity));
          }else if(pr.status=="orderCancelled"){
            cancelled+=1;
          }
        })
      })

      
       
      
    res.json({users,products,categories,total,cod,online,placed,cancelled});
   
})

export default router;