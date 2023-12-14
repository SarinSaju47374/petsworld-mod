import mongoose from  "mongoose";
const {Schema,model}  = mongoose;

const tokenSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
        unique:true,
    },
    token:{
        type:String,
        required:true,
    }
}, {timestamps: true}) 
tokenSchema.index({createdAt: 1},{expireAfterSeconds: 120});
// Get the indexes of the 'tokens' collection
const Token = model('token', tokenSchema);

export default Token;