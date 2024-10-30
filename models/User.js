const mongoose = require('mongoose');


/**
 * @description - User Schema for MongoDB
 * Defines the structure of the User document in the database,
 * including the required fields and validation rules.
 */


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
}, { timestamps: true }); // Automatically create createdAt and updatedAt fields

// Check if the User model already exists in mongoose; if not, define it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;