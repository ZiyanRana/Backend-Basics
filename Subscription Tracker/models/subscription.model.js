import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required!'],
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required!"],
        min: [0, 'Price cannot be less than 0!'],
    },
    currency: {
        type: String,
        enum: ['PKR', 'USD'],
        default: 'PKR',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: [true, 'Category is required!'],
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Start date cannot be in the future!',
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate();
            },
            message: 'Renewal date cannot be before start date!',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    }
}, {timestamps: true});

subscriptionSchema.pre('save', (next) => {
    if (!this.renewalDate) {    
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getData() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;