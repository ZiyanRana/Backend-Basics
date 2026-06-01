import userModel from "../src/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../src/config/env.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({email})
        if (existingUser) {
            const error = new Error('User with this email already exists!');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedpassword
        });

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie('token', token);

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: newUser
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again!"
        });
    }
}

export const signIn = async (req, res) => {
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again!"
        });
    }
}

export const signOut = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            const error = new Error('Authorization failed, cannot sign out!');
            error.statusCode = 401;
            throw error;
        }

        // eslint-disable-next-line no-unused-vars
        const decoded = jwt.verify(token, JWT_SECRET);

        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: "User signed out successfully!"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid token provided, couldn't sign the user out!"
        });
    }
}