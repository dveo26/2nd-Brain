import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import shareRoutes from './routes/share.routes';
import userRoutes from './routes/user.routes';
dotenv.config();
const app = express(); 
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/share', shareRoutes);
app.use('/api', userRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
