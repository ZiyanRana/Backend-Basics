import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import bcrypt from 'bcryptjs';

export const authArtist = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found!' });
        }

        if (user.role !== 'artist') {
            return res.status(403).json({ message: 'Only artists can access this resource!' });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token!' });
    }
}

export const authUser = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found!' });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token!' });
    }
}