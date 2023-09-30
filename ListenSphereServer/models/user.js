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
    },
    bio:{
        type:String,
    },
    pic:{
        type:String,
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
},{
    timestamps:true
});


const User = mongoose.model('users',userSchema)
export {User}