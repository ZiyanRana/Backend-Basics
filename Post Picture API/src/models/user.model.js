import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required!'],
        minLength: 3,
        maxLength: 25,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User email is required!'],
        minLength: 5,
        match: [/\S+@\S+\.\S+/, 'Email format is incorrect!'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});

const userModel = new mongoose.model("user", userSchema);

export default userModel;