export const runtime = 'nodejs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    console.log('Generating AI suggestions...');
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100,
      },
    });

    const result = await model.generateContent('Create 3 short anonymous message suggestions separated by ||');
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('AI suggestions generated:', generatedText);

    return NextResponse.json({ 
      success: true, 
      message: generatedText,
      suggestions: generatedText.split('||').map(s => s.trim()),
      model: 'gemini-1.5-flash'
    });
    
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate suggestions', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 