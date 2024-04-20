import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async() => {
    mongoose.set("strictQuery", true)

    if(isConnected) {
        console.log("MongoDB is already connected")
    }else {
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL environment variable is not set.");
            process.exit(1); // Exit the process or handle the error accordingly
        }
        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                dbName: "anhanhChat",
                useUnifiedTopology: true,
            });            
            isConnected = true;
            console.log("MongoDB is connected")
        } catch(error){
            console.log(error)
        }
    }
    
}