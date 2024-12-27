import React from 'react';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <span>Made by Tanmay Srivatsav</span>
          <a 
            href="https://github.com/tanmay019ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}