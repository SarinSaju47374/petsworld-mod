import mongoose from  "mongoose";
const {Schema,model}  = mongoose;

const otpSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
        unique:true,
    },
    otp:{
        type:Number,
        required:true,
        unique:true,
    }
}, {timestamps: true}) 
otpSchema.index({createdAt: 1},{expireAfterSeconds: 120});
// Get the indexes of the 'tokens' collection
const otpModel = model('otp', otpSchema);

export default otpModel;