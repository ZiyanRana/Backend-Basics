import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const existingUsername = await UserModel.findOne({ username: username }.session(session));
        if (existingUsername) {
            return res.status(400).json({ message: 'An account with this username already exists, login!' });
        }

        const existingEmail = await UserModel.findOne({ email: email }.session(session));
        if (existingEmail) {
            return res.status(400).json({ message: 'An account with this email already exists, login!' });
        }

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie('token', token);

        const newUser = await UserModel.create({
            username,
            email,
            password,
            role
        });

        session.commitTransaction();
        session.endSession();

        res.status(201).json(
            { 
                success: true,
                message: 'User registered successfully',
                user: newUser 
            });
    } 
    catch (err) {
        session.abortTransaction();
        session.endSession();
        console.error('Error during user registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.findOne({ 
            $or: [
                { username },
                { email }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            user: user
        });
    }
    catch (err) {
        console.error('Error during user sign-in:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const signOut = (req, res) => {
    try {
        if(!req.cookies.token) {
            return res.status(400).json({ message: 'No user is currently signed in!' });
        }

        res.clearCookie('token');

        res.status(200).json({ 
            success: true,
            message: 'User signed out successfully' 
        });
    }
    catch (err) {
        console.error('Error in signing the user out, Try again:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}