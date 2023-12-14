import express from "express";
import mongoose from "mongoose";
import path from "path";
import jwt2 from "jsonwebtoken"
import morgan from "morgan"
import multer from "multer";
import sharp from "sharp";

// At the component you want to use confetti
// import ConfettiGenerator from "confetti-js";
// import hbs from "hbs";
//Environment variables
import dotenv from 'dotenv';
dotenv.config();

//APP
const app = express();

//Logs OUR ACTIVITY
app.use(morgan("dev"));


//dirname configuration
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//HBS
import hbs from "hbs";
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper('joinPoints', function(points) {
  return points.join(',');
});

hbs.registerHelper('calculateTotal', function(items) {
  let total = 0;
  items.forEach(item => {
    total += item.productId.salePrice * item.quantity;
  });
 
  return total;
});
hbs.registerHelper('multiply', function(num1,num2) {
  return num1*num2;
});
hbs.registerHelper('convert', function(date) {
  const formattedDate = date.toLocaleDateString();
  return formattedDate;
});
hbs.registerHelper('parser', function(data) {
  const photo = JSON.parse(data).filepath
  return photo;
});
 
hbs.registerHelper('limitDog', function (arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  let array = arr.filter(val=>val.category.name==="DOG" && val.subCategory.name==="FOOD")
  return array.slice(0, limit);
});
hbs.registerHelper('limitCat', function (arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  let array = arr.filter(val=>val.category.name==="CAT" && val.subCategory.name==="FOOD")
  return array.slice(0, limit);
});
hbs.registerHelper('condition', function (num1) {
  return num1>=2;
});
 
//HBS and Static files configuration
app.set("view engine","hbs");
app.use(express.static(path.join(__dirname, "views","styles")));
app.set('views',[path.join(__dirname, 'views'),path.join(__dirname, 'views/pages'),path.join(__dirname, 'views/layouts')]);
app.use("/styles",express.static(path.join(__dirname,"views","styles")));
app.use("/uploads",express.static(path.join(__dirname,"views","uploads")));
app.use("/categories",express.static(path.join(__dirname,"views","categories")));
app.use("/profiles",express.static(path.join(__dirname,"views","profiles")));
app.use("/images",express.static(path.join(__dirname,"views","images")));
app.use("/videos",express.static(path.join(__dirname,"views","videos")));
app.use("/JS",express.static(path.join(__dirname,"views","JS")));
app.use(express.static('node_modules'));

// app.use("/node_modules",express.static(path.join(__dirname,"node_modules")));

//Mongooose Connection
mongoose.connect(process.env.MONGO_STRING);
// Connection event listeners
const dbConnection = mongoose.connection;

// Error event
dbConnection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Success event
dbConnection.once('open', () => {
  console.log('Connected to MongoDB');

  // Your code here - perform operations after successful connection
});

// Disconnection event
dbConnection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

 


//Form or JSON Configuration
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//MIME TYPE configuration
import { lookup } from "mime-types";

//Nodemailer Configuration
import nodemailer from "nodemailer";
//Middleware
import authoriseAdminJwt from "./Middleware/authoriseAdminJwt.js";
import authoriseJwt from "./Middleware/authoriseJwt.js";
//Routers
import userLoginRouter from "./routes/userLoginRouter.js"
import userRegisterRouter from "./routes/userRegisterRouter.js"
import forgotPageRouter from "./routes/forgotPageRouter.js"
import productMngmtRouter from "./routes/productMngmtRouter.js";
import productAddRouter from "./routes/productAddRouter.js";
import adminProductViewRouter from "./routes/adminProductViewRouter.js"
import adminLoginRouter from "./routes/adminLoginRouter.js" 
import adminUserViewRouter from "./routes/adminUserViewRouter.js"
import userProductViewRouter from "./routes/userProductViewRouter.js";
import ctgryAddRouter from "./routes/ctgryAddRouter.js"
import adminCtgryViewRouter from "./routes/adminCtgryViewRouter.js"
import userProductDescrRouter from "./routes/userProductDescrRouter.js";
import dogFoodRouter from "./routes/dogFoodRouter.js";
import userCartRouter from "./routes/userCartRouter.js";
import userOrderHistRouter from "./routes/userOrderHistRouter.js";
import userWishlistRouter from "./routes/userWishlistRouter.js"
import userCheckoutRouter from "./routes/userCheckoutRouter.js"
import userPymntRouter from "./routes/userPymntRouter.js"
import userAddressRouter from "./routes/userAddressRouter.js"
import handleAddressRouter from "./routes/handleAddressRouter.js"
import adminOrderRouter from "./routes/adminOrderRouter.js"
import adminDashRouter from "./routes/adminDashRouter.js"
import userProfileRouter from "./routes/userProfileRouter.js"
import adminAnalyticsRouter from "./routes/adminAnalyticsRouter.js"
import adminCouponsRouter from "./routes/adminCouponsRouter.js"
import walletRouter from "./routes/walletRouter.js"
//API routers
import productApi from "./routes/productApi.js";
import userApi from "./routes/userApi.js";
import customUserApi from "./routes/customApi.js";
import cartApi from "./routes/cartApi.js"
import wishlistApi from "./routes/wishlistApi.js"
import userModel from "./models/userModel.js";
import { walletModel } from "./models/productModel.js";
//DataRouter
import dataRouter from "./routes/dataRouter.js";

// import ctgryApi from "./routes/product"
//This code helps in preventing the access of logged in history content after Log out 
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
//Otp generator
async function sendEmail() {
  // Create a test account with ethereal
  // let testAccount = await nodemailer.createTestAccount();
  // Create a transporter using the ethereal SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "liliane.stroman46@ethereal.email",
      pass: 'jXRBdjgazuXdzFrU2f',
    },
  }); 
  const randomNumber = Math.floor(Math.random() * 1000);
  // Compose the email message
  let message = {
    from:"liliane.stroman46@ethereal.email",
    to: "sanjuag99@gmail.com",
    subject: "Random Number",
    text: `Here is your random number: ${randomNumber}`,
  };
  // Send the email
  let info = await transporter.sendMail(message);

  // Log the message details and preview URL
  console.log("Message sent: %s", info.messageId);
  
  // Genensole.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
// sendEmail().catch(console.error);
app.get("/crop",(req,res)=>{
  res.render("crop",{admin:false,user:false})
})

//API
app.use("/api",productApi);
// app.use("/products",productsApi);
app.use("/api",userApi);
app.use("/api",cartApi); 
app.use("/api",wishlistApi); 

app.use("/",handleAddressRouter);
app.use("/data",dataRouter);
app.use("/custom",customUserApi);

//Rendering Page
// app.use("/admin",productMngmtRouter);
app.use("/login",userLoginRouter);
app.use("/",userProductViewRouter);
app.use("/register",userRegisterRouter);
app.use("/forgot",forgotPageRouter);
app.use("/product-descr",userProductDescrRouter); 
app.use("/cart",authoriseJwt,userCartRouter);
app.use("/products",dogFoodRouter);
app.use("/checkout",authoriseJwt,userCheckoutRouter);
app.use("/address",authoriseJwt,userAddressRouter);
app.use("/pymnt",authoriseJwt,userPymntRouter);
app.use("/profile",authoriseJwt,userProfileRouter);
app.use("/wishlist",userWishlistRouter);
app.use("/order-history",authoriseJwt,userOrderHistRouter);
app.use("/admin",adminLoginRouter);
app.use("/wallet-hist",authoriseJwt,walletRouter);
app.use("/product-view",authoriseAdminJwt,adminProductViewRouter);
app.use("/product-add",authoriseAdminJwt,productAddRouter);
app.use("/user-view",authoriseAdminJwt,adminUserViewRouter);
app.use("/ctgry-add",authoriseAdminJwt,ctgryAddRouter);
app.use("/ctgry-view",authoriseAdminJwt,adminCtgryViewRouter);

app.use("/",authoriseAdminJwt,adminCouponsRouter);
app.get("/otp",(req,res)=>{
  res.render("otpLogin")
})

app.use("/",authoriseAdminJwt,adminOrderRouter);
app.use("/",authoriseAdminJwt,adminDashRouter);
app.use("/",authoriseAdminJwt,adminAnalyticsRouter);


// app.use(express.static("views", {
//   setHeaders: (res, path) => {
//     const contentType = lookup(path);
//     if (contentType === "text/css") {
//       res.setHeader("Content-Type", contentType);
//     }
//   }
// }));


//Just Test for admin Page SetUp

app.get("/test",(req,res)=>{
  res.render("justTest",{admin:true,user:false});
})

//Just Test for admin Page SetUp
import sendMail from "./utils/sendMail.js";
app.get("/sendMail",(req,res)=>{
  // 
  if(req.session.data){
    res.json({"session":req.session.data})
  }else{
    res.json({"session":"no session"})
  }
  
})

//Simulation of adding balance to users wallet
app.get("/save",async (req,res)=>{
  const walletData = {
    userId: '64a8007f58b6020233782b16',
    balance: 54543.456789,
  };
  
  // Create the wallet using the schema
  try{
    const wallet =   await walletModel.create(walletData);
    res.json("wallet created")
  }catch{
    res.json({"error":err})
  }
  
   
})

app.get("/testamigo",(req,res)=>{
  res.render("justATest")
})




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Endpoint for file upload and cropping
app.post('/upload', upload.array('croppedImages'), async (req, res) => {
  try {
    const croppedImages = req.files;

    // Check if any images were uploaded
    if (!croppedImages || croppedImages.length === 0) {
      return res.status(400).json({ message: 'No images were uploaded.' });
    }

    // Process the cropped images
    const processedImages = await Promise.all(
      croppedImages.map(async (image) => {
        const croppedBuffer = await sharp(image.path)
          .resize(500) // Adjust the desired size as needed
          .toBuffer();

        // Save the cropped image to a test directory
        const testPath = path.join('test', image.originalname);
        await sharp(croppedBuffer).toFile(testPath);

        return {
          filename: image.originalname,
          path: testPath,
        };
      })
    );

    res.status(200).json({ message: 'Images cropped and saved successfully.', processedImages });
  } catch (error) {
    console.error('Error while processing images:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


let port  = 8001;
app.listen(port,()=>{
    console.log(`App is listening at ${port}`)
})