import {Subscription} from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ... req.body,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: subscription,
        });

    } catch(error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id != req.params.id) {
        const error = new Error("You cannot view somebody else's subscriptions");
        error.statusCode = 401;
        throw error;
        }

        const subscriptions = await Subscription.find( {user: req.params.id });
        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch(error) {
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const allSubscriptions = await Subscription.find();
        res.status(200).json({
            success: true,
            data: allSubscriptions,
        });
    } catch(error) {
        next(error);
    }
}

export const getSubscription = async (req, res, next) => {
    try {
        const reqSubscription = await Subscription.findById(req.params.id);

        if (!reqSubscription) {
            const error = new Error('No subscription exist for the given id!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: reqSubscription,
        });
    } catch(error) {
        next(error);
    }
}