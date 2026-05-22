import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import albumRouter from './routes/album.routes.js';
import songRouter from './routes/song.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/albums', albumRouter);

export default app;