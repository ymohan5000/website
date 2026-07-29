import mongoose from 'mongoose';
import { config } from '../config/index.js';
export async function connectDB() {
    if (!config.mongodbUri) {
        console.warn('MONGODB_URI not set — running without database');
        return;
    }
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.warn('MongoDB connection unavailable — continuing without database:', err);
    }
}
