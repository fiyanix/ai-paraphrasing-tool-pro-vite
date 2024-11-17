import React, { useState } from 'react';
import { 
  PenLine,
  Volume2,
  Languages,
  Copy, 
  RotateCcw,
  Star,
  Fingerprint,
  RefreshCw,
  Wand2
} from 'lucide-react';
import TextCaptcha from './TextCaptcha';
import { paraphraseText } from '../services/paraphraseApi';
import { MAX_WORDS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../config/constants';
import type { ToneType } from '../types';

const ParaphrasingTool = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<ToneType>('professional');
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('en');
  const [lengthPreference, setLengthPreference] = useState<'shorter' | 'similar' | 'longer'>('similar');
  const [verified, setVerified] = useState(false);
  const [wordCount, setWordCount] = useState({ input: 0, output: 0 });

  const handleInputChange = (text: string) => {
    setInputText(text);
    const words = text.split(/\s+/).filter(Boolean).length;
    setWordCount(prev => ({ ...prev, input: words }));
    setError(words > MAX_WORDS ? `Text exceeds ${MAX_WORDS} words limit` : null);
  };

  const handleParaphrase = async () => {
    if (!verified) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    if (wordCount.input > MAX_WORDS) {
      setError(`Text exceeds ${MAX_WORDS} words limit`);
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter some text to paraphrase');
      return;
    }

    setError(null);
    setIsLoading(true);
    setOutputText('');

    try {
      const result = await paraphraseText({
        text: inputText,
        targetLanguage,
        tone,
        lengthPreference
      });
      setOutputText(result);
      setWordCount(prev => ({
        ...prev,
        output: result.split(/\s+/).filter(Boolean).length
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to paraphrase text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy text to clipboard');
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setWordCount({ input: 0, output: 0 });
    setVerified(false);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneType)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
          </select>

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as SupportedLanguage)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map(({ code, name }) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>

          <select
            value={lengthPreference}
            onChange={(e) => setLengthPreference(e.target.value as 'shorter' | 'similar' | 'longer')}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="shorter">Shorter</option>
            <option value="similar">Similar Length</option>
            <option value="longer">Longer</option>
          </select>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <PenLine size={16} />
                Input Text
              </span>
              <span>{wordCount.input}/{MAX_WORDS} words</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-64 p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Wand2 size={16} />
                Paraphrased Text
              </span>
              <span>{wordCount.output} words</span>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Paraphrased text will appear here..."
              className="w-full h-64 p-4 text-sm bg-gray-50 border border-gray-200 rounded-lg resize-none"
            />
          </div>
        </div>

        {/* Verification and Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <TextCaptcha onVerify={setVerified} />

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleParaphrase}
              disabled={!inputText || isLoading || wordCount.input > MAX_WORDS || !verified}
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Wand2 size={16} />
                  Paraphrase
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
              title="Copy to clipboard"
            >
              {isCopied ? <Star size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaphrasingTool;