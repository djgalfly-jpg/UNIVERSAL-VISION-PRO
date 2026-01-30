import React from 'react';
import { Zap } from 'lucide-react';
import SongAnalysis from './components/SongAnalysis';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-black text-gray-200 selection:bg-cyber-primary selection:text-black">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Zap className="text-cyber-primary animate-pulse-fast" size={24} />
              <span className="text-xl font-bold tracking-widest text-white">
                UNIVERSAL ORCHARD <span className="text-cyber-primary">A&R</span>
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                  <span className="text-xs font-mono text-gray-500">ENGINEERED BY GALFLY & KRYLIN</span>
                  <div className="h-2 w-2 rounded-full bg-cyber-success animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-cyber-dark/30 backdrop-blur-sm rounded-2xl p-1 min-h-[80vh]">
            <SongAnalysis />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full bg-cyber-black border-t border-gray-900 py-2 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-600 font-mono">
            <div>UNIVERSAL ORCHARD MUSIC GROUP © 2025</div>
            <div>
              <span className="mr-4">INTERNAL USE ONLY</span>
              <span>LATIN GRAMMY CERTIFIED SYSTEM</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
