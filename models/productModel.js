import { model, Schema } from "mongoose";

//products schema
const productSchema = new Schema({
  productName: {
    type: String,
  },
  brandName: {
    type: String,
  },
  description: {
    type: String,
  },
  points: {
    type: [String],
  },
  productPrice: {
    type: Number,
  },
  discount: {
    type:Number,
    default:2,
  },
  salePrice: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  stock: {
    type: Number,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  paymentOption: {
    type: String,
  },
  rating: {
    type: Number,
  },
  photo: {
    type: [{ title: String, filepath: String }],
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const couponSchema = new  Schema({
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
  expires:Date,
}, {timestamps: true});
couponSchema.index({createdAt: 1},{expireAfterSeconds: 3600});


// //cart schema
// const cartSchema = new Schema(
//   {userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'users',
//     required: true,
//   },
//   items: [
//     {
//       productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'product',
//         required: true,
//       },
//       productName: {
//         type:String,
//       },
//       brandName:{
//         type:String
//       },
//       description: {
//           type:String,
//       },
//       productPrice: {
//           type:Number,
//       },
//       salePrice:{
//           type:Number,
//       },
//       stock: {
//           type:Number,
//       },
//       category: {
//           type:String,
//       },
//       subCategory:{
//           type:String,
//       },
//       createdAt:{
//           type:Date,
//           default:()=>Date.now(),
//       },
//       paymentOption:{
//           type:String,
//       },
//       rating:{
//           type:Number,
//       },
//       photo: {
//         title: String,
//         filepath: String,
//       },
//       quantity:Number,
//     },
//   ],}
//   ,{
//   collection:"cart"
// });
// const cartSchema = new Schema(
//   {userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   items: [
//     {
//       productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'product',
//         required: true,
//       },
//       quantity:Number,

//     },
//   ],}
//   ,{
//   collection:"cart"
// });

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: Number,
      },
    ],
  },
  {
    collection: "cart",
  }
);

// // Middleware to update item price and total price when quantity is changed
// cartSchema.pre('save', async function (next) {
//   if (this.isModified('items')) {
//     try {
//       const populateOptions = { path: 'items.productId', select: 'salePrice' };
//       const cart = await this.constructor.populate(this, populateOptions);

//       let totalPrice = 0;

//       const updatedItems = cart.items.map((item) => {
//         item.price = item.productId.salePrice * item.quantity;
//         totalPrice += item.price;
//         return item;
//       });

//       this.items = updatedItems;
//       this.totalPrice = totalPrice;
//     } catch (error) {
//       console.log(error);
//       return next(error);
//     }
//   }

//   next();
// });

const addressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  fName: {
    type: String,
    requried: true,
  },
  lName: String,
  addr: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  ph: {
    type: Number,
    required: true,
  },
  isShippingAddress: {
    type: Boolean,
    default: false,
  },
});

addressSchema.pre("save", async function (next) {
  if (this.isShippingAddress) {
    // Remove the isShippingAddress flag from other addresses for the same user
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isShippingAddress: false } }
    );
  }
  next();
});

// //order Schema
// const orderSchema = new Schema({
//     address: {
//       type: Schema.Types.ObjectId,
//       ref: 'address',
//       required: true,
//     },
//     product: [{
//       type: Schema.Types.ObjectId,
//       ref: 'cart',
//     }],
//     paymentMode: {
//       type: String,
//       required: true,
//     },

// });
const orderSchema = new Schema({
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    fName: {
      type: String,
      requried: true,
    },
    lName: String,
    addr: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    ph: {
      type: Number,
      required: true,
    },
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      salePrice: {
        type:Number,
        set: (value) => parseFloat(value.toFixed(2)),
      },
      quantity: Number,
      status: {
        type: String,
        required: true,
        default: "orderPlaced",
      },
      orderPlaced: {
        type: Date,
      },
      orderShipped: {
        type: Date,
      },
      orderOnRoute: {
        type: Date,
      },
      orderCancelled: {
        type: Date,
      },
      orderDelivered: {
        type: Date,
      },
      orderReturned:{
        type:Date,
      },
      expectedDelivery: {
        type: Date,
      },
    },
  ],
  paymentmode: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
    required: true,
  },
});

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      },
    ],
  },
  {
    collection: "wishlist",
  }
);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    offer:{
      type:Number,
      default:0,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "category",
  }
);
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "subCategory",
  }
);
const walletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'transaction',
    },
  ],
},
{
  collection: "wallet",
});

const transactionSchema = new Schema({
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'wallet',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  type: {
    type: String,
    enum: ['recharge', 'deduction'],
    required: true,
  },
  date: {
    type: Date,
    default: ()=>Date.now(),
  },
},
{
  collection: "transaction",
});

const walletModel = model('wallet', walletSchema);
const transactionModel = model('transaction', transactionSchema);
const productModel = model("product", productSchema);
const couponModel = model("coupon", couponSchema);
const cartModel = model("cart", cartSchema);
const wishlistModel = model("wishlist",wishlistSchema);
const addressModel = model("address", addressSchema);
const orderModel = model("orders", orderSchema);
const ctgryModel = model("category", categorySchema);
const subCtgryModel = model("subCategory", subCategorySchema);
export {
  productModel,
  cartModel,
  addressModel,
  orderModel,
  ctgryModel,
  subCtgryModel,
  couponModel,
  walletModel,
  transactionModel,
  couponSchema,
  wishlistModel,
};
