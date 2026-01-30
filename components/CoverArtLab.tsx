import React, { useState } from 'react';
import { Upload, Wand2, ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { editCoverArt, blobToBase64 } from '../services/geminiService';
import { CoverArtState } from '../types';

const CoverArtLab: React.FC = () => {
  const [state, setState] = useState<CoverArtState>({
    isLoading: false,
    originalImage: null,
    generatedImage: null,
    prompt: '',
    error: null
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await blobToBase64(file);
        setState(prev => ({ ...prev, originalImage: base64, generatedImage: null, error: null }));
      } catch (err) {
        setState(prev => ({ ...prev, error: "Failed to load image." }));
      }
    }
  };

  const handleGenerate = async () => {
    if (!state.originalImage || !state.prompt) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Calls Gemini 2.5 Flash Image
      const resultBase64 = await editCoverArt(state.originalImage, state.prompt);
      setState(prev => ({ ...prev, isLoading: false, generatedImage: resultBase64 }));
    } catch (err) {
        console.error(err);
      setState(prev => ({ ...prev, isLoading: false, error: "Failed to edit image. Try a different prompt." }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
            <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="text-pink-500" />
                    Cover Art Lab
                </h2>
                <p className="text-gray-400 font-mono text-sm mt-2">POWERED_BY: GEMINI_NANO_BANANA</p>
            </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Original Image */}
            <div className="bg-cyber-panel border border-gray-800 rounded-xl p-6 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-gray-500">INPUT_SOURCE</span>
                    <label className="cursor-pointer px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white border border-gray-600 transition-colors">
                        SELECT_FILE
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center overflow-hidden relative group">
                    {state.originalImage ? (
                        <img 
                            src={`data:image/png;base64,${state.originalImage}`} 
                            alt="Original" 
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-center p-8">
                            <ImageIcon size={48} className="mx-auto text-gray-700 mb-2" />
                            <p className="text-gray-600 font-mono text-sm">DROP_IMAGE_DATA_HERE</p>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-xs font-mono text-gray-400 mb-2">MODIFICATION_PROMPT:</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={state.prompt}
                            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                            placeholder="e.g., 'Add a retro glitch filter' or 'Make it cyberpunk style'"
                            className="flex-1 bg-black border border-gray-700 rounded p-3 text-white focus:border-pink-500 focus:outline-none font-mono text-sm"
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={!state.originalImage || !state.prompt || state.isLoading}
                            className="bg-pink-600 hover:bg-pink-500 text-white p-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {state.isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Generated Image */}
            <div className="bg-cyber-panel border border-gray-800 rounded-xl p-6 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-pink-500">GENERATED_OUTPUT</span>
                    {state.generatedImage && (
                        <a 
                            href={`data:image/png;base64,${state.generatedImage}`} 
                            download="cover_art_remix.png"
                            className="px-3 py-1 bg-pink-500/20 hover:bg-pink-500/40 rounded text-xs text-pink-400 border border-pink-500/50 transition-colors flex items-center gap-1"
                        >
                            <Save size={12} /> SAVE
                        </a>
                    )}
                </div>

                <div className="flex-1 bg-black/40 rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden relative">
                     {state.isLoading ? (
                         <div className="text-center">
                             <div className="inline-block w-16 h-1 bg-pink-600 rounded-full animate-pulse mb-4"></div>
                             <p className="text-pink-500 font-mono text-xs animate-pulse">PROCESSING_PIXELS...</p>
                         </div>
                     ) : state.generatedImage ? (
                        <img 
                            src={`data:image/png;base64,${state.generatedImage}`} 
                            alt="Generated" 
                            className="w-full h-full object-contain"
                        />
                     ) : (
                         <p className="text-gray-700 font-mono text-sm">WAITING_FOR_EXECUTION</p>
                     )}
                </div>

                {state.error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-900 rounded text-red-400 text-xs font-mono">
                        ERROR: {state.error}
                    </div>
                )}
            </div>

        </div>
    </div>
  );
};

export default CoverArtLab;
