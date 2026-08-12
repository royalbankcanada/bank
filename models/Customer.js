const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    customerId: {
        type: String,
        required: true,
        unique: true
    },

    accessCode: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    birthDate: String,

    gender: String,

    nationality: String,

    profession: String,

    country: String,

    city: String,

    address: String,

    accountType: String,

    currency: {
        type: String,
        default: "CAD"
    },

    profileImage: {
    type: String,
    default: ""
},

    password: {
        type: String,
        required: true
    },

    accountNumber: {
        type: String,
        unique: true
    },

    transitNumber: String,

    institutionNumber: String,

    debitCard: String,

    cvv: String,

    expiryDate: String,

    balance: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);
