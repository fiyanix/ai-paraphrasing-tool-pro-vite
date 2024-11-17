import React from 'react';
import { MAX_WORDS } from '../config/constants';

interface WordCounterProps {
  currentWords: number;
}

const WordCounter: React.FC<WordCounterProps> = ({ currentWords }) => {
  const isOverLimit = currentWords > MAX_WORDS;

  return (
    <div className={`text-xs sm:text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
      {currentWords} / {MAX_WORDS} words {isOverLimit && '(limit exceeded)'}
    </div>
  );
};

export default WordCounter;