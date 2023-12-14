import mongoose from "mongoose";
const {model,Schema} = mongoose;

const adminSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    fName:{
        type:String,
        required:true,
    },
    lName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    psswd:{
        type:String,
        required:true,
    },
})



const adminModel = model("admin",adminSchema);
export default adminModel;