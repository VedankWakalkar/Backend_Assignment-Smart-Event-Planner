import mongoose, { ConnectionStates } from "mongoose";
import { DB_URL, NODE_ENV } from "../config/env.js";

if(!DB_URL){
    console.log("Checking for the Database URL: ",DB_URL);
    throw new Error("Please Provide the Database URL")
}

const connectToDatabase= async()=>{
    try {
        await mongoose.connect(DB_URL);
        console.log(`Connected to The Database in the ${NODE_ENV} mode`)
    } catch (error) {
        console.log("Some Error Occured : ",error);
        process.exit(1)
    }
}

export default connectToDatabase;