import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Session user is required!']
    },
    refreshToken: {
        type: String,
        required: [true, 'Session refresh token is required!'],
    },
    ip: {
        type: String,
        required: [true, 'User ip address is required!'],
    },
    userAgent: {
        type: String,
        required: [true, 'User agent is required!'],
    },
    revoke: {
        type: Boolean,
        default: false
    }
}, { timestamps: true } );

const sessionModel = mongoose.model('Session', sessionSchema);

export default sessionModel;