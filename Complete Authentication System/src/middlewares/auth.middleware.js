import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false,message: 'Unauthorized, no token provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

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