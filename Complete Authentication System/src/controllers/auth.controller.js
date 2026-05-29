import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { NODE_ENV, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, COOKIE_EXPIRES_IN, oneDay } from "../config/env.js";
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

        const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        const cookieMaxAge = COOKIE_EXPIRES_IN * oneDay;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: cookieMaxAge,
            path: '/'
        });

        return res.status(201).json({ 
            success: true,
            message: 'User created successfully!',
            user: {
                username: user.username,
                email: user.email
            },
            token: accessToken
         });
    }
    catch (error) {
        console.error('Unexpected error occured while signing up:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error, please try again!' });
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

        const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        const cookieMaxAge = COOKIE_EXPIRES_IN * oneDay;

        res.cookie('refreshToken', refreshToken, {
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
            },
            token: accessToken
         });
    }
    catch (error) {
        console.error('Unexpected error occured while signing in:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error, please try again!' 
        });
    }
}

export const getMe = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'User fetched successfully!',
        you: {
            username: req.user.username,
            email: req.user.email
        }
    });
}

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized, no token provided!' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: decoded.userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        const cookieMaxAge = COOKIE_EXPIRES_IN * oneDay;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: cookieMaxAge,
            path: '/'
        });

        return res.status(200).json({ 
            success: true,
            message: 'Token refreshed successfully!',
            token: accessToken
        });
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized, invalid token provided!' });
    }
}