import mongoose from "mongoose";
const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    socials:{
        instagram:{
            type:String,
            default:""
        },
        twitter:{
            type:String,
            default:""
        },
    },
    email:{
        type:String,
        required:true
    },
    bio:{
        type:String,
    },
    pic:{
        type:String,
    },
},{
    timestamps:true
});


const User = mongoose.model('users',userSchema)
export {User}