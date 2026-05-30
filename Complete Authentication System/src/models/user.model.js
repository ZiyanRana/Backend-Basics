import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: [true, 'Username cannot have leading or trailing spaces'],
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [20, 'Username can be at most 20 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Email format is not valid'],
        trim: [true, 'Email cannot have leading or trailing spaces'],
        minLength: [5, 'Email must be at least 5 characters long'],
        maxLength: [50, 'Email can be at most 50 characters long']
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least 8 characters long']
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model('User', userSchema);

export default userModel;