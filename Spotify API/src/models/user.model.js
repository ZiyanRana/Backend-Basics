import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: [true, 'Username is already taken!'],
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: [true, 'User email is required!'],
        unique: [true, 'Email is already registered!'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['User', 'Artist'],
        default: 'User'
    }
}, {timestamps: true});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;