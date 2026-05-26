/* eslint-disable no-undef */
import { config } from 'dotenv';

config({
    path: `.env.${process.env.NODE_ENV}`
});

export const {
    NODE_ENV,
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;