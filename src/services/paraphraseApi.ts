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
  lengthPreference,
}: ParaphraseParams): Promise<string> {
  try {
    const response = await fetch('/api/paraphrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        tone,
        lengthPreference,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch from backend');
    }

    const data = await response.json();

    if (!data.paraphrasedText) {
      throw new Error('Invalid response format from backend');
    }

    return data.paraphrasedText;
  } catch (error) {
    console.error('Paraphrasing error:', error);
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred. Please try again.');
  }
}
