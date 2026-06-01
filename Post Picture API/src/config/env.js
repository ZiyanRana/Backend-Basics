import { config } from 'dotenv';

config(
    { path: `.env.${process.env.NODE_ENV}`}
);

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    private_key,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;