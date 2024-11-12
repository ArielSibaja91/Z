import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import notificationRoutes from './routes/notification.routes';
import dotenv from 'dotenv';
import connectMongo from './database/mongoConection';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const PORT = process.env.PORT|| 5000;

app.use(express.json({limit: "5mb"})); // Parsing req.body
// This limit value shouldn't be so high to prevent DOS attacks
app.use(cookieParser()); // Uses cookie-parser
app.use(express.urlencoded({ extended: true })); // Parsing form data

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`)
    connectMongo();
});