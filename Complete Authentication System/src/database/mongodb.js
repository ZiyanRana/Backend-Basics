import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

const connectDB = async () => {
    if (!MONGO_URI) {
        throw new Error('MONGO_URI is not defined in the environment variables');
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');
    }
    catch (error) {
        console.error('Unexpected error occured while connecting to MongoDB:', error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
}

export default connectDB;