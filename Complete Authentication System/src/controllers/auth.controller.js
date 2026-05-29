import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, COOKIE_EXPIRES_IN } from "../config/env.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Some required field is missing from the user input!' });
    }

    try {
        const exitingUser = await userModel.findOne(
            { $or: [
                { username },
                { email }
            ]}
        );

        if (exitingUser) {
            return res.status(400).json({ message: 'User already exists, login!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
            path: '/'
        });

        return res.status(201).json({ 
            success: true,
            message: 'User created successfully!',
            user: {
                username: user.username,
                email: user.email
            }
         });
    }
    catch (error) {
        console.error('Unexpected error occured while signing up:', error);
        return res.status(500).json({ message: 'Internal server error, please try again!' });
    }
}

export const signIn = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({ message: 'Email or username is required to sign in!' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required to sign in!' });
    }

    try {
        const user = await userModel.findOne(
            { $or: [
                { username },
                { email }
            ]}
        );

        if (!user) {
            return res.status(400).json({ message: 'Cannot sign in, user not found!' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect, try again!' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const oneDay = 24 * 60 * 60 * 1000;
        const cookieMaxAge = COOKIE_EXPIRES_IN * oneDay;

        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: cookieMaxAge,
            path: '/'
        });

        return res.status(200).json({ 
            success: true,
            message: 'User signed in successfully!',
            user: {
                username: user.username,
                email: user.email
            }
         });
    }
    catch (error) {
        console.error('Unexpected error occured while signing in:', error);
        return res.status(500).json({ message: 'Internal server error, please try again!' });
    }
}

export const signOut = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No user is currently signed in!' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            return res.status(200).json({ 
                success: true,
                message: 'User signed out successfully!'
            });
        }
    }
    catch (error) {
        console.error('Unexpected error occured while signing out:', error);
        return res.status(400).json({ message: 'No user with the provided token is currently signed in!' });
    }
}