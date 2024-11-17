import React from 'react';
import { Shield, Lock, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Privacy & Security
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• No data storage</li>
              <li>• Secure API connections</li>
              <li>• Rate limiting protection</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Cpu size={18} className="text-blue-600" />
              Features
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• AI-powered paraphrasing</li>
              <li>• Multiple writing styles</li>
              <li>• Plagiarism-free content</li>
              <li>• Multi-language support</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Lock size={18} className="text-blue-600" />
              Usage Guidelines
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 1000 words per request</li>
              <li>• 50 requests per 15 minutes</li>
              <li>• Verification required</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AI Paraphrasing Tool. All rights reserved.</p>
          <p className="mt-2">Powered by advanced AI technology for accurate and reliable paraphrasing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;