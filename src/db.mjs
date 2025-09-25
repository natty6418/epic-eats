import mongoose from 'mongoose';

const MONGODB_URI = process.env.DSN;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        // Use existing database connection
        return cached.conn;
    }

    if (!cached.promise) {
        // Create a new database connection and use a promise to handle it
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    console.log('Connected to the database');
    return cached.conn;
}

export default connectDB;
