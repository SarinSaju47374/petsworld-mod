import express from "express";
import {productAdd} from "../controllers/controllers.js";
import multer from "multer";
import { productModel } from "../models/productModel.js";
import fs from "fs";
import fsExtra from "fs-extra";
import sharp from "sharp";
import util from 'util';
import path from "path";

const router = express.Router();

router.get("/",productAdd);
router.use(express.json()); 

const upload = multer({ dest: 'views/uploads' });

router.post('/', upload.array('photos'), async (req, res) => {
  try {
    const {
      productName,
      brandName,
      description,
      points,
      productPrice,
      discount,
      stock,
      ctgryId,
      subCtgryId,
      paymentOption,
      rating,
      imageRatio,
    } = req.body;

    const photos = [];

    for (const file of req.files) {
      const oldPath = path.join('views/uploads', file.filename); // Update the old path
      const newPath = path.join('views/uploads', `${file.filename}.png`); // Update the new path

      if (fs.existsSync(oldPath)) {
        await fs.promises.rename(oldPath, newPath);
        console.log('File renamed successfully');

        try {
          // Open the image with Sharp
          const image = sharp(newPath);

          // Calculate the desired aspect ratio
          const [num, denom] = imageRatio.split(':');
          const aspectRatio = parseFloat(num) / parseFloat(denom);

          // Get the image metadata and extract the width
          const metadata = await image.metadata();
          const width = metadata.width;

          // Calculate the desired height based on the aspect ratio
          const height = Math.floor(width / aspectRatio);

          // Validate the cropping dimensions
          if (width < height) {
            throw new Error('Invalid aspect ratio. Width is smaller than the desired height.');
          }

          // Crop the image
          const croppedImagePath = newPath.replace('.png', '_cropped.png');

          const imageWidth = metadata.width;
          const imageHeight = metadata.height;

          let cropWidth, cropHeight;
          if (imageWidth / imageHeight >= aspectRatio) {
            cropHeight = imageHeight;
            cropWidth = Math.floor(cropHeight * aspectRatio);
          } else {
            cropWidth = imageWidth;
            cropHeight = Math.floor(cropWidth / aspectRatio);
          }

          const left = Math.floor((imageWidth - cropWidth) / 2);
          const top = Math.floor((imageHeight - cropHeight) / 2);

          await image.extract({ left, top, width: cropWidth, height: cropHeight }).toFile(croppedImagePath);
          console.log('Cropped image successfully:', croppedImagePath);

          photos.push({
            title: file.originalname,
            filepath: croppedImagePath.replace(/views/gi, ''),
          });

          // // Delay before deleting the original uncropped image
          // await new Promise((resolve) => setTimeout(resolve, 1000));

          // // Delete the original uncropped image
          // await fs.promises.unlink(newPath);

          setTimeout(async () => {
            try {
              await fsExtra.remove(newPath);
              console.log('Deleted original image:', newPath);
            } catch (err) {
              console.error('Error while deleting original image:', err);
            }
          }, 100); // Adjust the delay if needed
          console.log('Deleted original image:', newPath);
        } catch (err) {
          console.error('Error while cropping image:', err);
        }
      } else {
        console.log('File does not exist at the old path:', oldPath);
      }
    }

    let salePrice = productPrice - (productPrice * Number(discount)) / 100;

    await productModel.create({
      productName: productName,
      brandName: brandName,
      description: description,
      points: points.split(','),
      productPrice: productPrice,
      discount: discount,
      salePrice: Number(salePrice),
      stock: stock,
      category: ctgryId,
      subCategory: subCtgryId,
      paymentOption: paymentOption,
      rating: rating,
      photo: photos,
    });

    console.log('Successfully added product to the database');
    res.redirect('/product-view');
  } catch (error) {
    console.error('Error while processing the form:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


export default router;