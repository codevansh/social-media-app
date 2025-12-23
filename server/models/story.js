import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true
    },
    content: {
        type: String,
    },
    media_urls: {
        type: String
    },
    media_type: {
        type: String,
        enum: ["image", "text", "video"],
    },
    views_count: [
        {
            type: String,
            ref: "User"
        }
    ],
    bg_color: {
        type: String
    },
}, {
    timestamps: true,
    minimize: false
});

StorySchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 86400 },
    // { maxLength: 60 },
    // { max_size: 5 * 10 * 1024 * 1024}
);

const Story = mongoose.model("Story", StorySchema);
export default Story