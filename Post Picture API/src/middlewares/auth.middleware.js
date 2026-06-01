import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/config/env.js";
import userModel from "../models/user.model.js";


export const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || (req.headers?.authorization?.startsWith('Bearer ')? req.headers.authorization.split(' ')[1] : null);

    if (!token || token === 'null') {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, no token provided!"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Cannot procees, user associated with this token does not exist!"
            });
        }

        req.user = user;
        return next();
        
    }
    catch(error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, token is invalid!"
        });
    }
}