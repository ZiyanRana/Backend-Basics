import mongoose from "mongoose";
import User from '../models/user.model.js';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        const {name, email, password} = req.body;

        // Check existing user
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const error = new Error('User already exist!');
            error.statusCode = 409;
            throw error;
        }

        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
    }
};

export const signIn = async (req, res, next) => {

};

export const signOut = async (req, res, next) => {

};