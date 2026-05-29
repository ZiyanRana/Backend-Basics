import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);

export default app;