import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>
{
    // Check if already connected
    if(connection.isConnected)
    {
        console.log('Already connected to Database')
        return; 
    }
    
    // Check if connection URI exists
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        throw new Error('MONGODB_URI environment variable is not set');
    }
    
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Optimized connection options for Vercel serverless
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false, // Disable mongoose buffering for serverless
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        });

        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected Successfully");

    } catch (error: any) {
        console.error('Database connection failed:', error.message);
        connection.isConnected = 0; // Reset connection status
        
        // More detailed error logging for debugging
        if (error.name === 'MongoServerSelectionError') {
            console.error('MongoDB server selection failed. Check your connection string and network access.');
        }
        if (error.name === 'MongoNetworkError') {
            console.error('MongoDB network error. Check your internet connection and MongoDB Atlas settings.');
        }
        
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

export default dbConnect;