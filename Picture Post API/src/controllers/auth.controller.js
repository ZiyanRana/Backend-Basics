import mongoose from "mongoose";
import userModel from "../src/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../src/config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({email}).session(session);
        if (existingUser) {
            const error = new Error('User with this email already exists!');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUsers = await userModel.create([{name, email, password: hashedpassword}], {session});

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.cookie('token', token);

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: newUsers[0]
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({email});
        
        if (!existingUser) {
            const error = new Error('User with this email does not exist!');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: "User signed in successfully!",
            user: existingUser
        });
    }
    catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            const error = new Error('Authorization failed, cannot sign out!');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId).session(session);

        if (!user) {
            const error = new Error('User associated with this token does not exist!');
            error.statusCode = 404;
            throw error;
        }

        res.cookies.token = null;

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "User signed out successfully!"
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}