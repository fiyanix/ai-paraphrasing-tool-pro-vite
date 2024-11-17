import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface TextCaptchaProps {
  onVerify: (verified: boolean) => void;
}

const generateCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const TextCaptcha: React.FC<TextCaptchaProps> = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserInput('');
    setError(false);
    onVerify(false);
  };

  const validateCaptcha = () => {
    const isValid = userInput.toUpperCase() === captcha;
    setError(!isValid);
    onVerify(isValid);
  };

  useEffect(() => {
    if (userInput.length > 0) {
      validateCaptcha();
    }
  }, [userInput]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-gray-500" />
        <span className="text-sm text-gray-600">Verification</span>
      </div>
      
      <div className="relative">
        <div className="px-4 py-2 bg-gray-100 rounded-lg select-none" 
             style={{
               fontFamily: 'monospace',
               fontSize: '1.25rem',
               letterSpacing: '0.25em',
               background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e5e5e5 10px, #e5e5e5 20px)'
             }}>
          {captcha}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(45deg, transparent 45%, #00000010 45%, #00000010 55%, transparent 55%)'
             }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          placeholder="Enter code"
          maxLength={6}
          className={`w-32 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
        />
        
        <button
          onClick={refreshCaptcha}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
          title="Generate new code"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
};

export default TextCaptcha;