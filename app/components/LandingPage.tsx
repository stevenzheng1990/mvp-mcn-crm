// SimplifiedLandingPage.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateToSystem: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* 极简内容 */}
      <div className="text-center pointer-events-none">
        <h1 className="text-6xl font-bold">Coming soon</h1>
      </div>

      {/* 系统入口按钮 */}
      <button
        onClick={onNavigateToSystem}
        className="fixed bottom-8 right-8 group flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-xl text-white border border-white/30 rounded-full font-medium hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-2xl pointer-events-auto drop-shadow-lg"
      >
        Enter Management
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default LandingPage;