import { Router } from "express";
import { signUp, signIn, signOut, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

// Path: /api/v1/auth
authRouter.post('/register', signUp);
authRouter.post('/login', signIn);
authRouter.post('/logout', signOut);
authRouter.get('/get-me', authMiddleware, getMe);

export default authRouter;