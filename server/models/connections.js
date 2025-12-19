import mongoose from "mongoose";

const connectionsSchema = new mongoose.Schema({
    from_user_id: {
        type: String,
        ref: "User",
        required: true
    },
    to_user_id: {
        type: String,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted'],
        default: 'Pending'
    },
}, {
    timestamps: true
})

const Connection = mongoose.model('Connection',connectionsSchema)

export default Connection