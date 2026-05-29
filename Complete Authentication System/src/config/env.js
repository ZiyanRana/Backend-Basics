/* eslint-disable no-undef */
import { config } from 'dotenv';

config({
    path: `.env.${process.env.NODE_ENV}`
});

export const {
    NODE_ENV,
    PORT,
    MONGO_URI,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,
    COOKIE_EXPIRES_IN,
    oneDay
} = process.env;