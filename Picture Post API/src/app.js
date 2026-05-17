import express from 'express';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: false} ));
app.use(cookieParser());

app.use('/api/v1/post', postRouter);

export default app;