// importing mongoose
import mongoose from "mongoose";

// connecting to database
const connectDB= async ()=>{
    try{
        // process.env.MONGO_URI is the connection string
        const connection=await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected "+connection.connection.host);
    }catch(err){
        // handling error
        console.log(err)
        process.exit(1)
    }
}

// exporting connectDB
export default connectDB