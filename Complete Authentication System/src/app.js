import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRouter);

export default app;