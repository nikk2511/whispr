export const runtime = 'nodejs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('Suggest messages API called');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const prompt = "Create 3 short, engaging anonymous message suggestions separated by '||'. Each message should be under 60 characters, positive, friendly, and suitable for anonymous messaging. Keep them concise and simple. Example format: 'What's your favorite hobby?||What made you smile today?||Share a fun fact about yourself!'";

    console.log('Using prompt:', prompt);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('Generated suggestions:', generatedText);

    return NextResponse.json({ message: generatedText });
    
  } catch (error) {
    console.error('Error in suggest-messages API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
