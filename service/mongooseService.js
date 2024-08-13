import mongoose from 'mongoose';
import { DATABASE_NAME, MONGO_URI, USER_DB_NAME } from '../constants/constants.js';
import { mongooseConfig } from '../config/mongooseConfig.js';

export async function mongooseConnect() {
    try {
        await mongoose.connect(MONGO_URI, { ...mongooseConfig, dbName: DATABASE_NAME });
        console.log("MongoDB connected via Mongoose!");
    } catch (err) {
        console.error("Connection error on MongoDB via Mongoose: " + err);
        process.exit(1); 
    }
}

export default mongoose;
