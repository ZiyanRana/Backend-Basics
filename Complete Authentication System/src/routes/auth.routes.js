import { Router } from "express";
import { signUp, signIn, signOut, signOutAll, getMe, refreshToken, getOtp, verifyOtp } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

// Path: /api/v1/auth
authRouter.post('/register', signUp);
authRouter.post('/login', signIn);
authRouter.post('/logout', signOut);
authRouter.post('/logout-all', signOutAll);
authRouter.get('/get-me', authMiddleware, getMe);
authRouter.get('/refresh-token', refreshToken);
authRouter.get('/get-otp', getOtp);
authRouter.post('/verify-user', verifyOtp);

export default authRouter;