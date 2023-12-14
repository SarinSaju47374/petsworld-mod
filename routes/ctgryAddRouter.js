import express from "express";
import {ctgryAdd} from "../controllers/controllers.js";
import multer from "multer";
import { subCtgryModel,ctgryModel } from "../models/productModel.js";
import fs from "fs";

const router = express.Router();
 
router.get("/",ctgryAdd);
router.use(express.json());

const upload = multer({ dest: 'views/categories' });

router.post("/subCtgry", upload.single('photo'), async (req, res) => {
  const {subCtgry,ctgryId} = req.body;

  // Get the uploaded file from req.file and extract necessary information
  const file = req.file;
  
  if (file) {
    const oldPath = file.path;
    const newPath = `${file.path}.png`;

    if (fs.existsSync(oldPath)) {
      fs.rename(oldPath, newPath, function(err) {
        if (err) throw err;
        console.log('File renamed successfully');
      });
    } else {
      console.log('File does not exist at the old path:', oldPath);
    }
  
    const photo = JSON.stringify({
        title: file.originalname,
        filepath: newPath.replace(/views/gi,""),
      });

    if(!ctgryId) res.json({"success":false})
    await subCtgryModel.create({
        name:subCtgry.toUpperCase().trim(),
        category:ctgryId,
        photo,
    });
    console.log("Successfully added product to the database");
    res.json({"success":true});
  } else {
    console.log("No photo uploaded");
    res.status(400).send("No photo uploaded");
  }
});
router.post("/ctgry", async (req, res) => {
    const {ctgry} = req.body;
    console.log(req.body);
    try{
        await ctgryModel.create({
            name:ctgry.toUpperCase().trim(),
        });
        console.log("Successfully added product to the database");
        res.json({"success":true});
    }catch(err){
        console.log(err);
    }
});


router.get("/fetch",async (req,res)=>{
  let ctgrys = await ctgryModel.find();
  res.json(ctgrys);
})

router.get("/fetch/:id",async (req,res)=>{
   let {id} = req.params;
   let subCtgrys = await subCtgryModel.find({category:id})
   res.json(subCtgrys);
})

router.get("/api/ctgrys",async(req,res)=>{
  try {
    let sort = req.query.sort || "name,-1";
    const search = req.query.s || "";
    const total = await ctgryModel.countDocuments({
            name: { $regex: search, $options: "i" },
    })
    const limit = !isNaN(parseInt(req.query.l)) && parseInt(req.query.l) <= 3
    ? parseInt(req.query.l)||3
    : 3;
    const page = !isNaN(parseInt(req.query.p)) && parseInt(req.query.p) >= 0 && parseInt(req.query.p) <= Math.ceil(total/limit)    
    ? parseInt(req.query.p)-1||0
    :0;
      
    // Sort options
    const sortOptions = sort.split(",");
    const sortBy = {};
    if (sortOptions.length === 2) {
      sortBy[sortOptions[0]] = parseInt(sortOptions[1]);
    } else {
      sortBy[sortOptions[0]] = 1;
    }
    // Query for product collection
    const categories = await ctgryModel.find(
            { name: { $regex: search, $options: "i" } }
    )
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      categories
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
})


router.get("/api/subCtgrys",async(req,res)=>{
  try {
    let sort = req.query.sort || "name,-1";
    const search = req.query.s || "";
    const regex = new RegExp(search, 'i');
    const totalCount = await subCtgryModel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { "category.name": { $regex: search, $options: "i" } }
          ]
        }
      },
      {
        $lookup: {
          from: "categories", // replace "categories" with the actual name of your category collection
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $count: "total"
      }
    ]);
    
    const total = totalCount.length > 0 ? totalCount[0].total : 0;
    

    const limit = !isNaN(parseInt(req.query.l)) && parseInt(req.query.l) <= 3
    ? parseInt(req.query.l)||3
    : 3;
    const page = !isNaN(parseInt(req.query.p)) && parseInt(req.query.p) >= 0 && parseInt(req.query.p) <= Math.ceil(total/limit)    
    ? parseInt(req.query.p)-1||0
    :0;
      
    // Sort options
    const sortOptions = sort.split(",");
    const sortBy = {};
    if (sortOptions.length === 2) {
      sortBy[sortOptions[0]] = parseInt(sortOptions[1]);
    } else {
      sortBy[sortOptions[0]] = 1;
    }
    // Query for product collection
    const subCategories = await subCtgryModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { "category.name": { $regex: search, $options: "i" } }
      ]
  })  .populate('category')
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      subCategories
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
})
export default router;
