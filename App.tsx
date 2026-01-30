import React from 'react';
import { Zap, ShieldCheck, Wifi, Server } from 'lucide-react';
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="bg-cyber-dark/30 backdrop-blur-sm rounded-2xl p-1 min-h-[80vh]">
            <SongAnalysis />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full bg-[#020202] border-t border-gray-900/80 py-2 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono gap-3 md:gap-0">
            
            {/* Copyright */}
            <div className="text-gray-600 order-3 md:order-1">UNIVERSAL ORCHARD MUSIC GROUP © 2025</div>
            
            {/* API STATUS INDICATOR (CENTER) */}
            <div className="order-1 md:order-2 flex items-center gap-6 bg-gray-900/60 px-6 py-1.5 rounded-full border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
               
               {/* Connection Status */}
               <div className="flex items-center gap-2 border-r border-gray-700 pr-4">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  </div>
                  <span className="tracking-[0.15em] text-green-500 font-bold drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                      API_UPLINK: ESTABLISHED
                  </span>
               </div>

               {/* Key Verification */}
               <div className="flex items-center gap-1.5 text-gray-400">
                  <ShieldCheck size={12} className="text-cyber-primary" />
                  <span className="tracking-widest">KEY: SECURE_ENV</span>
               </div>

               {/* Latency Simulation */}
               <div className="flex items-center gap-1.5 text-gray-500 hidden sm:flex">
                  <Server size={12} />
                  <span>LATENCY: 12ms</span>
               </div>
            </div>

            {/* Certifications */}
            <div className="text-gray-600 hidden md:block order-3 text-right">
              <span className="mr-4">INTERNAL USE ONLY</span>
              <span className="text-gray-500">LATIN GRAMMY CERTIFIED</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;