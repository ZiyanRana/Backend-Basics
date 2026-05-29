import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

// Path: /api/v1/auth
authRouter.post('/register', signUp);
authRouter.post('/login', signIn);
authRouter.post('/logout', signOut);

export default authRouter;