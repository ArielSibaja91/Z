import express from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import connectMongo from './database/mongoConection';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT|| 5000;

app.use(express.json()); // Parsing req.body
app.use(cookieParser()); // Uses cookie-parser
app.use(express.urlencoded({ extended: true })); // Parsing form data
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`)
    connectMongo();
});