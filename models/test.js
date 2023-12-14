import {model,Schema} from "mongoose";

const testSchema = new Schema({
    name:{
        type:String
    },
    age:{
        type:Number
    },
    comments:{
        type:String
    }
})

const testModel = model("user",testSchema);

export default testModel;