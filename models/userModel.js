import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { couponSchema } from "./productModel.js";
const userSchema = new Schema({
  photo: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  psswd: {
    type: String,
    required: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  addresses: [
    {
      addrId: {
        type: Schema.Types.ObjectId,
        ref: "address",
      },
    },
  ],
  coupons:{
    type:[
      {
        coupon: {
          type: String,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        minPrice: {
          type: Number,
          required: true,
        },
        expires:{
          type:Date,
        },
        applied: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default:[],
  },
});

const userModel = model("user", userSchema);
export default userModel;
