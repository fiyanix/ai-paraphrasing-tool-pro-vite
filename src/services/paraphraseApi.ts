import type { SupportedLanguage } from '../config/constants';
import type { ToneType } from '../types';

interface ParaphraseParams {
  text: string;
  targetLanguage: SupportedLanguage;
  tone: ToneType;
  lengthPreference: 'shorter' | 'similar' | 'longer';
}

export async function paraphraseText({
  text,
  targetLanguage,
  tone,
  lengthPreference
}: ParaphraseParams): Promise<string> {
  try {
    const response = await fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional paraphrasing assistant. Follow these guidelines:
              - Ensure the result is grammatically correct
              - Simplify Language: Replace complex words with simpler alternatives
              - Vary Sentence Structure: Use a mix of short and long sentences
              - Keep the tone ${tone}
              - Make the text ${lengthPreference} than the original
              - Translate to ${targetLanguage} if different from source
              - Review for Coherence: Ensure logical flow and original message
              - Maintain technical accuracy
              - Use Active Voice
              - Remove redundancies`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Paraphrasing error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to paraphrase text. Please try again.');
  }
}