import express from 'express';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: false} ));
app.use(cookieParser());

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', authRouter);

export default app;