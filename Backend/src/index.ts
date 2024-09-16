import express from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import connectMongo from './database/mongoConection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`)
    connectMongo();
})