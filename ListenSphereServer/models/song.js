import mongoose from "mongoose";
const songSchema= mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    preview:{
        type:String
    },
    ownedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    }
},{
    timestamps:true
});


const Song = mongoose.model('song',songSchema)
export {Song}