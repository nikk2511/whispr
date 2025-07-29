import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test environment variable
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('MONGODB_URI exists:', process.env.MONGODB_URI ? 'Yes' : 'No');
    console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
    
    // Test database connection
    await dbConnect();
    
    // Get connection status
    const connectionStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      connectionStatus: statusMap[connectionStatus as keyof typeof statusMap] || 'unknown',
      mongooseVersion: mongoose.version,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      mongooseVersion: mongoose.version,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 