const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    depositId: {
        type: String,
        unique: true
    },

    customerId: {
        type: String,
        required: true
    },

    amount: {
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

module.exports = mongoose.model("Transaction", transactionSchema);
