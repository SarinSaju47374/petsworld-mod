import express from "express";
import {} from "../controllers/controllers.js";
import moment from "moment";
import {
  orderModel,
  ctgryModel,
  productModel,
} from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { startOfDay, subDays, format } from "date-fns";

const router = express.Router();

router.get("/analytics", (req, res) => {
  res.render("analytics", { admin: true, user: false });
});
router.post("/analytics/data", async (req, res) => {
  let { timeFrame, startDate, endDate } = req.body;
  startDate = moment(startDate).startOf('day').toDate();
  endDate = moment(endDate).endOf('day').toDate();
 
  console.log(startDate, endDate);

  //Modidfication in Data representation ************
  let data = await orderModel.aggregate([
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        orderId:"$_id",
        date: "$date",
        fullName:{ $concat: ["$address.fName", " ", "$address.lName"] },
        productName:"$product.productName",
        salePrice: "$products.salePrice",
        status: "$products.status",
      },
    },
  ]);
  console.log(data);
  let filteredData = [];
  data.forEach((val) => {
    const currentDate = moment(val.date);
    if (
      startDate <= currentDate  &&
      endDate >= currentDate && val.status == "orderDelivered"
    ) {
      filteredData.push(val);
    }
  });

  //Grouping Data Based on Week , Year and Month
  let groupedData = {};
  filteredData.forEach((val) => {
    const currentDate = moment(val.date);
    let label;

    // Group by month
    if (timeFrame === "monthly") {
      label = currentDate.format("MMMM YYYY");
    }
    // Group by year
    else if (timeFrame === "yearly") {
      label = currentDate.format("YYYY");
    }
    // Group by week
    else if (timeFrame === "weekly") {
      label = `Week ${currentDate.week()}`;
    }

    if (!groupedData[label]) {
      groupedData[label] = [];
    }

    groupedData[label].push(val);
    
  });

  //Adding up the SalePrice (Here also the representation Changes)
  Object.keys(groupedData).forEach((label) => {
    const group = groupedData[label];
    let totalSalePrice = 0;
  
    group.forEach((item) => {
      totalSalePrice += item.salePrice;
    });
  
    totalSalePrice;
     groupedData[label] = totalSalePrice;
  });
  res.json({data:groupedData,orders:filteredData});
});

export default router;
