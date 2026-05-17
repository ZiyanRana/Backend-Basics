import userModel from "../src/models/user.model.js";

export const signUp = async (req, res, next) => {
    try {
        const existingUser = userModel.findOne({email})
    }
    catch (error) {
        next(error);
    }
}