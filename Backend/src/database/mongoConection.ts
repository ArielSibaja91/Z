import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;

        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined");
        }

        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectMongo;
