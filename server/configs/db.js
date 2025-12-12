import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/social-media`);
        console.log("Database connected");
    } catch (e) {
        console.log("Error while connecting to database", e);
    }
}

export default db;