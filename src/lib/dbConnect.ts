import mongoose from "mongoose";

type ConnectionObject = {

    isConnected ?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>
{
    if(connection.isConnected)
    {
        console.log('Already connected to Database')
        return; 
    }
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        // process.exit(1);
    }
    try {
        // console.log(process.env.MONGODB_URI)
        const db = await mongoose.connect(process.env.MONGODB_URI! || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully");

    } catch (error: any) {
        console.log('DataBase connection failed', error.message);
        // process.exit(1);        
    }
}

export default dbConnect;