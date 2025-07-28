export const runtime = 'nodejs';


import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    console.log('Testing Gemini API connection...');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    console.log('API Key present:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 50,
      },
    });

    const result = await model.generateContent('Say hello in a friendly way');
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('Gemini API test successful. Generated text:', generatedText);

    return NextResponse.json({ 
      success: true, 
      message: 'Gemini API is working correctly!',
      testResponse: generatedText,
      model: 'gemini-1.5-flash'
    });
    
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Gemini API test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.GEMINI_API_KEY
      },
      { status: 500 }
    );
  }
} 