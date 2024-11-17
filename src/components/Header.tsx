import React from 'react';
import { Wand2, Shield, Zap, Globe2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wand2 size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">AI Paraphrasing Tool</h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-green-500" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 size={18} className="text-blue-500" />
              <span>Multiple Languages</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;