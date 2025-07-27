import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Present' : 'Missing',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `Present (${process.env.GEMINI_API_KEY?.substring(0, 10)}...)` : 'Missing',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Present' : 'Missing',
      },
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 