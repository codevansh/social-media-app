import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    full_name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        max_length: 15
    },

    password: {
        type: String,
        required: true,
        max_length: 12,
        min_length: 8
    },

    bio: {
        type: String,
        default: "Hey there! I am new to Pingup"
    },

    profile_picture: {
        type: String,
        default: ""
    },

    cover_photo: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    followers: [{
        type: String,
        ref: "User"
    }],

    following: [{
        type: String,
        ref: "User"
    }],

    connections: [{
        type: String,
        ref: "User"
    }],

}, {
    timestamps: true,
    minimize: false
})

const User = mongoose.model("User", UserSchema);

export default User;