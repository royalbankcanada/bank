const mongoose = require("mongoose");

const administrativeTransactionSchema = new mongoose.Schema({

    depositId: {
        type: String,
        unique: true,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    aggregator: {
        type: String,
        required: true
    },

    amountCAD: {
        type: Number,
        required: true
    },

    localAmount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "PENDING"
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "administrativeTransaction",
        administrativeTransactionSchema
    );
