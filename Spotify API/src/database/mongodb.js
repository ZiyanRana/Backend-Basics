import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js';

const connectDB = async () => {
    if (!DB_URI) {
        console.error('DB_URI is not defined in environment variables');
        process.exit(1);
    }
    try {
        await mongoose.connect(DB_URI);
        console.log('Database connected successfully');
    } 
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;   