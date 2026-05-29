import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized, no token provided!' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized, user not found!' });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized, token invalid!' });
    }
}

export default authMiddleware;