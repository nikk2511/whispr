import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('API endpoint called - generate-message (Gemini)');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { topic = '', tone = 'friendly', length = 'medium', messageType = 'general' } = body;

    // Create simple prompt
    let prompt = `Write a ${length} anonymous message in a ${tone} tone.`;
    if (topic) {
      prompt += ` The topic should be related to: ${topic}.`;
    }
    prompt += ' Keep it positive, respectful, and appropriate for anonymous messaging. Write only the message content, nothing else.';

    console.log('Generated prompt:', prompt);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('Generated text:', generatedText);

    return NextResponse.json({ message: generatedText });
    
  } catch (error) {
    console.error('Error in generate-message API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 