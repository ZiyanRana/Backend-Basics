import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectToDb = async () => {

    if (!DB_URI) {
        const error = new Error("No DB_URI string in env file");
        error.statusCode = 500;
        throw error;
    }
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to DB");
    }
    catch (error) {
        console.error(error);
    }
}

export default connectToDb;