import mongoose from "mongoose";
import colors from "colors";
mongoose.set("strictQuery", false);
//====================create mongodb conncetion 

export const MongoDBCnncetion =async()=>{
    try {
        const conncetion = await mongoose.connect(process.env.MOGO_SERVER,{ useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true, // Remove this line
            useFindAndModify: false}) // This is also deprecated, consider removing or updating})
        console.log(`MongoDB connection successfully !`.bgGreen.cyan)
    } catch (error) {
        console.log(error.message)
    }
}