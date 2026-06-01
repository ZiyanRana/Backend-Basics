import userModel from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NODE_ENV, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, COOKIE_EXPIRES_IN } from "../config/env.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";
import { generateOtpCode, generateOtpHtml } from "../utils/otp.utils.js";
import sendEmail from "../services/email.service.js";

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

        const otp = generateOtpCode();
        const otpHash = await bcrypt.hash(otp, 10);

        await otpModel.create({
            user: user._id,
            email,
            otp: otpHash
        });

        const otpSubject = 'Authentication System - OTP Verification Code';
        const otpText = `Your verification code is: ${otp}. Use this code to verify your account. If you did not request this code, you can safely ignore this email.`;
        const otpHtml = generateOtpHtml(otp);

        await sendEmail(email, otpSubject, otpText, otpHtml);

        return res.status(201).json({ 
            success: true,
            message: 'User created successfully, verify yourself through the otp sent to your email to use our features! ',
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
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
        if (!user.verified) {
            return res.status(400).json({ message: 'User not verified! You cannot sign in, please verify your email first!' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect, try again!' });
        }

        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = await sessionModel.create({
            user: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        const accessToken = jwt.sign({ userId: user._id, sessionId: session._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const cookieExpiresIn = Number(COOKIE_EXPIRES_IN);
        const oneDay = 24*60*60*1000;
        const cookieMaxAge = cookieExpiresIn * oneDay;
        
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
        console.error('Error occured while signing in:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error, please try again!' 
        });
    }
}

export const signOut = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Cannot log out, no user is logged in!' });
    }

    try {
        // eslint-disable-next-line no-unused-vars
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = await sessionModel.findOne({ refreshToken: refreshTokenHash, revoke: false });
        if (!session) {
            return res.status(401).json({ success: false, message: 'Cannot log out, no user login session found!' });
        }

        session.revoke = true;
        await session.save();

        res.clearCookie('refreshToken', {
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
    catch (error) {
        console.error('Error signing user out: ', error);
        return res.status(401).json({ success: false, message: "Unauthorized, couldn't verify token!" });
    }
}

export const signOutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Cannot log out, no user is logged in!' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        await sessionModel.updateMany({
            user: decoded._id,
            revoke: false
        }, {
            revoke: true
        }); 

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: 'User signed out from all devices successfully!'
        });
    }
    catch (error) {
        console.error('Error signing user out from all devices: ', error);
        return res.status(401).json({ success: false, message: "Unauthorized, couldn't verify token!" });
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

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized, no token provided!' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = await sessionModel.findOne({
            refreshToken: refreshTokenHash,
            revoke: false
        });

        if (!session) {
            return res.status(401).json({ success: false, message: 'Unauthorized, user login session not found!' });
        }

        const newRefreshToken = jwt.sign({ userId: decoded.userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        session.refreshToken = newRefreshTokenHash;
        await session.save();

        const accessToken = jwt.sign({ userId: decoded.userId, sessionId: session._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

        const cookieExpiresIn = Number(COOKIE_EXPIRES_IN);
        const oneDay = 24*60*60*1000;
        const cookieMaxAge = cookieExpiresIn * oneDay;

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

export const getOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Cannot proceed, user email not found!' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Cannot proceed, user not found!' });
        }

        if (user.verified) {
            return res.status(400).json({ success: false, message: 'User already verified, no need for otp!' });
        }

        const otp = generateOtpCode();
        const otpHash = await bcrypt.hash(otp, 10);

        await otpModel.create({
            user: user._id,
            email,
            otp: otpHash
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully!',
            otp
        });
    }
    catch (error) {
        console.error('Error sending otp: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error, please try again!' });
    }
}

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Cannot proceed, user email not found!' });
    }
    if (!otp) {
        return res.status(400).json({ success: false, message: 'Cannot proceed, otp not found!' });
    }

    try {
        const userOtpHash = await bcrypt.hash(otp, 10); 
        const otpValue = await otpModel.find({
            email,
            otp: userOtpHash
        });

        if (!otpValue) {
            return res.status(400).json({
                success: false,
                message: 'Cannot verify user, incorrect otp entered!'
            });
        }

        await userModel.findOneAndUpdate({
            email,
            verified: false
        }, {
            verified: true
        });

        otpModel.deleteMany({
            email
        });

        return res.status(200).json({
            success: true,
            message: 'User verified successfully! You can now login and use the application!'
        });
    }
    catch (error) {
        console.error('Error verifying user: ', error);
        return res.status(400).json({ success: false, message: 'Cannot verify user, please try again!' });
    }
}