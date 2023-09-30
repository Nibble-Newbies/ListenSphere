import mongoose from "mongoose";
const friendRequestSchema= mongoose.Schema({
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    receiverUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    status:{
        type:String,
        default:"pending"
    }

},{
    timestamps:true
});


const FriendRequest = mongoose.model('friend',friendRequestSchema)
export {FriendRequest}

