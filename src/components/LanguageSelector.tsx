import React from 'react';
import { Globe2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../config/constants';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onChange }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <Globe2 size={18} className="text-gray-500 flex-shrink-0" />
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value as SupportedLanguage)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        {SUPPORTED_LANGUAGES.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;