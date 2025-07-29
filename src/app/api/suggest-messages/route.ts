export const runtime = 'nodejs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    console.log('Generating message suggestions...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    console.log('API Key present:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 1.2, // Increased for more randomness
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 150,
      },
    });

    // Array of different prompt themes for variety
    const promptThemes = [
      "motivational and encouraging anonymous messages",
      "thoughtful and caring anonymous messages", 
      "friendly and supportive anonymous messages",
      "uplifting and positive anonymous messages",
      "kind and compassionate anonymous messages",
      "inspiring and hopeful anonymous messages",
      "gentle and comforting anonymous messages",
      "cheerful and optimistic anonymous messages"
    ];

    // Array of different contexts for more variety
    const contexts = [
      "for someone having a tough day",
      "to brighten someone's mood", 
      "to show someone they're appreciated",
      "to make someone smile",
      "to remind someone they matter",
      "to spread positivity",
      "to offer encouragement",
      "to show kindness to a stranger"
    ];

    // Randomly select theme and context
    const randomTheme = promptThemes[Math.floor(Math.random() * promptThemes.length)];
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    
    // Add random timestamp to ensure uniqueness
    const timestamp = new Date().getTime();
    
    const prompt = `Generate 3 unique ${randomTheme} ${randomContext}. Make them diverse, heartfelt, and under 50 characters each. Separate them with ||. Be creative and avoid repetitive themes. Random seed: ${timestamp}`;

    console.log('Using prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    console.log('Message suggestions generated successfully:', generatedText);

    return NextResponse.json({ 
      success: true, 
      message: generatedText,
      suggestions: generatedText.split('||').map(s => s.trim()),
      model: 'gemini-1.5-flash'
    });
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate suggestions', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.GEMINI_API_KEY
      },
      { status: 500 }
    );
  }
} 