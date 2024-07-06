import mongoose from "mongoose";
import colors from "colors";

//====================create mongodb conncetion 

export const MongoDBCnncetion =()=>{
    try {
        const conncetion = mongoose.connect(process.env.MOGO_SERVER)
        console.log(`MongoDB connection successfully !`.bgGreen.cyan)
    } catch (error) {
        console.log(error.message)
    }
}