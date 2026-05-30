import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'OTP user is required!']
    },
    email: {
        type: String,
        required: [true, 'User email is required!'],
    },
    otp: {
        type: String,
        required: [true, 'OTP is required!'],
    }
});

const otpModel = mongoose.model('OTP', otpSchema);

export default otpModel;