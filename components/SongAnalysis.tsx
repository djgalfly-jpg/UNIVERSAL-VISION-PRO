import React, { useState } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { SongAnalysisData, AnalysisState } from '../types';
import { analyzeSong, blobToBase64 } from '../services/geminiService';
import AudioVisualizer from './AudioVisualizer';
import { Loader2, Upload, Play, Pause, Award, Mic2, BarChart3, Share2, TrendingUp, Smartphone, Youtube, Instagram, Activity, Globe, Disc, Sliders, Music2, CheckCircle2, CalendarClock, ArrowUpRight, Palette, Clapperboard, Timer, Lock, ShieldCheck } from 'lucide-react';

type Language = 'es' | 'en';

const SongAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<Language>('es');
  const [showWelcome, setShowWelcome] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsPlaying(false);
      // Reset analysis when new file is loaded
      setAnalysis({ isLoading: false, data: null, error: null });
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalysis({ isLoading: true, data: null, error: null });
    setIsPlaying(false);
      
    try {
      const base64 = await blobToBase64(file);
      const result = await analyzeSong(base64, file.type);
      setAnalysis({ isLoading: false, data: result, error: null });
    } catch (err: any) {
      setAnalysis({ 
        isLoading: false, 
        data: null, 
        error: err.message || "Analysis Error: System overload or file rejected." 
      });
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const getRadarData = (data: SongAnalysisData) => [
    { subject: 'PROD', A: data.productionScore || 0, fullMark: 100 },
    { subject: 'VIRAL', A: data.successScore || 0, fullMark: 100 },
    { subject: 'VOCAL', A: 85, fullMark: 100 }, 
    { subject: 'ORIG', A: (data.successScore || 0) * 0.8, fullMark: 100 },
    { subject: 'MIX', A: (data.productionScore || 0) * 0.9, fullMark: 100 },
  ];

  // UI Labels Dictionary
  const uiText = {
    es: {
      import: "IMPORTAR MASTER/DEMO",
      monitor: "MONITOR DE ESTUDIO A",
      trackInfo: "DATOS DE PISTA",
      noTape: "ESPERANDO FUENTE DE AUDIO",
      startAnalyze: "INICIAR DIAGNÓSTICO PROFESIONAL",
      analyzing: "EJECUTANDO UNIVERSAL VISION PRO...",
      listening: "SISTEMA A&R PROCESANDO...",
      calc: "DETECTANDO FRECUENCIAS Y MERCADO",
      successProj: "INDICE DE VIABILIDAD COMERCIAL",
      potential: "POTENCIAL",
      global: "GLOBAL",
      awaiting: "SISTEMA LISTO // ESPERANDO AUDIO",
      engReport: "INFORME TÉCNICO DE INGENIERÍA",
      approvedBy: "SUPERVISADO POR: GALFLY & KRYLIN",
      mixQual: "ANÁLISIS DE MEZCLA (RANGO DINÁMICO & EQ)",
      vocalChain: "CADENA DE PROCESAMIENTO VOCAL",
      bpm: "BPM",
      key: "TONALIDAD",
      genre: "SUB-GÉNERO",
      campaignVis: "ESTRATEGIA DE LANZAMIENTO",
      targetAud: "DEMOGRAFÍA OBJETIVO",
      marketingHook: "CONCEPTO DE CAMPAÑA",
      proAdvice: "DIRECTIVA EJECUTIVA",
      adviceText: "Ejecutar cambios de mezcla antes de la distribución. Priorizar mercados emergentes detectados.",
      gtmStrat: "ESTRATEGIA VISUAL & SOCIAL",
      tiktokTrend: "VULNERABILIDAD TIKTOK",
      viralHooks: "MOMENTOS CLAVE (HOOKS):",
      instaAes: "DIRECCIÓN DE ARTE (IG)",
      ytContent: "FORMATO & EDICIÓN (YT)",
      comparisonTitle: "BENCHMARKING DE MERCADO",
      comparisonSubtitle: "ANÁLISIS COMPARATIVO VS ÉXITOS GLOBALES",
      similarity: "SIMILITUD",
      differentiator: "FACTOR ÚNICO",
      preReleaseTitle: "FASE PRE-LANZAMIENTO",
      preReleaseSub: "4 SEMANAS ANTES DEL DROP",
      assetsReq: "ASSETS REQUERIDOS",
      checklist: "CHECKLIST TÁCTICO",
      postReleaseTitle: "PROTOCOLO POST-LANZAMIENTO",
      week1: "SEMANA 1: LANZAMIENTO",
      week2: "SEMANA 2: SOSTENIBILIDAD",
      month1: "MES 1: EXPANSIÓN",
      visualTech: "ESPECIFICACIONES TÉCNICAS VISUALES",
      contentPillar: "PILARES DE CONTENIDO",
      noData: "Datos no disponibles."
    },
    en: {
      import: "IMPORT MASTER/DEMO",
      monitor: "STUDIO MONITOR A",
      trackInfo: "TRACK DATA",
      noTape: "AWAITING AUDIO SOURCE",
      startAnalyze: "INITIATE PROFESSIONAL DIAGNOSTIC",
      analyzing: "RUNNING UNIVERSAL VISION PRO...",
      listening: "A&R SYSTEM PROCESSING...",
      calc: "DETECTING FREQUENCIES & MARKET FIT",
      successProj: "COMMERCIAL VIABILITY INDEX",
      potential: "POTENTIAL",
      global: "GLOBAL",
      awaiting: "SYSTEM READY // AWAITING AUDIO",
      engReport: "TECHNICAL ENGINEERING REPORT",
      approvedBy: "SUPERVISED BY: GALFLY & KRYLIN",
      mixQual: "MIX ANALYSIS (DYNAMIC RANGE & EQ)",
      vocalChain: "VOCAL PROCESSING CHAIN",
      bpm: "BPM",
      key: "KEY",
      genre: "SUB-GENRE",
      campaignVis: "RELEASE STRATEGY",
      targetAud: "TARGET DEMOGRAPHICS",
      marketingHook: "CAMPAIGN CONCEPT",
      proAdvice: "EXECUTIVE DIRECTIVE",
      adviceText: "Execute mix revisions before distribution. Prioritize detected emerging markets.",
      gtmStrat: "VISUAL & SOCIAL STRATEGY",
      tiktokTrend: "TIKTOK VULNERABILITY",
      viralHooks: "KEY MOMENTS (HOOKS):",
      instaAes: "ART DIRECTION (IG)",
      ytContent: "FORMAT & EDITING (YT)",
      comparisonTitle: "MARKET BENCHMARKING",
      comparisonSubtitle: "COMPARATIVE ANALYSIS VS GLOBAL HITS",
      similarity: "SIMILARITY",
      differentiator: "UNIQUE FACTOR",
      preReleaseTitle: "PRE-RELEASE PHASE",
      preReleaseSub: "4 WEEKS BEFORE DROP",
      assetsReq: "REQUIRED ASSETS",
      checklist: "TACTICAL CHECKLIST",
      postReleaseTitle: "POST-RELEASE PROTOCOL",
      week1: "WEEK 1: LAUNCH",
      week2: "WEEK 2: SUSTAIN",
      month1: "MONTH 1: EXPANSION",
      visualTech: "VISUAL TECHNICAL SPECS",
      contentPillar: "CONTENT PILLARS",
      noData: "Data unavailable."
    }
  };

  const t = uiText[lang];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">

      {/* WELCOME MODAL */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
           <div className="bg-[#0a0a0a] border border-yellow-600/30 p-8 rounded-2xl max-w-3xl w-full mx-4 text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)]">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-cyber-primary to-purple-600" />
              <div className="absolute top-0 right-0 p-4 opacity-50">
                  <Lock size={20} className="text-gray-600" />
              </div>
              
              <div className="mb-6 flex flex-col items-center">
                  <div className="p-4 bg-yellow-500/10 rounded-full mb-4 ring-1 ring-yellow-500/20">
                    <Award className="text-yellow-500" size={48} />
                  </div>
                  <div className="text-[10px] font-mono text-yellow-500 tracking-[0.4em] uppercase mb-2">Internal System Access</div>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-1">
                    Universal Vision <span className="text-cyber-primary">Pro</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-500">ENGINEERED BY GALFLY & KRYLIN</p>
              </div>
              
              <p className="text-gray-300 mb-8 leading-relaxed font-light text-sm md:text-base max-w-2xl mx-auto">
                Bienvenido al sistema clasificado de análisis A&R de <strong>Universal Orchard Music</strong>. 
                Esta herramienta utiliza algoritmos de grado industrial para deconstruir tu música, 
                compararla con el Top 50 Global y generar estrategias de lanzamiento de nivel "Major Label".
                <br/><br/>
                <span className="text-yellow-500/80 italic">Advertencia: Los resultados son técnicos, despiadados y diseñados para el éxito comercial.</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
                 <div className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-yellow-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                        <Mic2 size={16} />
                        <h4 className="font-bold text-xs uppercase">Audio Forensics</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug">Desglose técnico de frecuencias, mezcla y cadena vocal en Hz/dB.</p>
                 </div>
                 <div className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-cyber-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-cyber-primary">
                        <TrendingUp size={16} />
                        <h4 className="font-bold text-xs uppercase">Market Fit</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug">Comparativa algorítmica con éxitos de Billboard y predicción viral.</p>
                 </div>
                 <div className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-purple-500">
                        <ShieldCheck size={16} />
                        <h4 className="font-bold text-xs uppercase">Launch Protocol</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug">Estrategias de "Universal Orchard Ingestion" y dirección de arte visual.</p>
                 </div>
              </div>

              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black uppercase tracking-[0.2em] transition-all rounded shadow-lg shadow-yellow-500/20 text-sm flex items-center justify-center gap-2"
              >
                Acceder al Sistema
                <ArrowUpRight size={16} />
              </button>
           </div>
        </div>
      )}
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-yellow-600/30 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
               <Award className="text-yellow-500" size={24} />
               <span className="text-yellow-500 font-mono text-xs tracking-[0.3em] uppercase">Universal Orchard A&R Division</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
             UNIVERSAL VISION <span className="text-cyber-primary">PRO</span>
           </h1>
           <p className="text-gray-400 text-sm mt-1 font-mono">
             LEAD ENGINEERS: <span className="text-white">GALFLY & KRYLIN</span>
           </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
             {/* Language Toggle */}
             <div className="flex items-center gap-0 border border-cyber-primary/50 rounded overflow-hidden">
                <button 
                  onClick={() => setLang('es')}
                  className={`px-3 py-1 text-xs font-bold font-mono transition-colors ${lang === 'es' ? 'bg-cyber-primary text-black' : 'bg-black text-gray-500 hover:text-white'}`}
                >
                  ES
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-bold font-mono transition-colors ${lang === 'en' ? 'bg-cyber-primary text-black' : 'bg-black text-gray-500 hover:text-white'}`}
                >
                  EN
                </button>
             </div>
             <div className="text-[10px] text-cyber-secondary font-mono tracking-widest">SYSTEM V3.0 // ONLINE</div>
        </div>
      </div>

      {/* UPLOAD & VISUALIZER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-black/40 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-cyber-primary to-purple-600"></div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-mono text-sm text-gray-400 tracking-wider">{t.monitor}</span>
                </div>
                <label className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-cyber-primary/5 border border-cyber-primary text-cyber-primary font-bold rounded hover:bg-cyber-primary hover:text-black transition-all uppercase tracking-widest text-[10px]">
                    <Upload size={14} /> {t.import}
                    <input type="file" onChange={handleFileChange} accept="audio/*" className="hidden" />
                </label>
            </div>

            <AudioVisualizer audioFile={file} isPlaying={isPlaying} />

            <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                 {/* Playback Control */}
                 <button 
                    onClick={togglePlay} 
                    disabled={!file}
                    className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-full bg-cyber-dark text-white hover:border-cyber-primary border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-black/50"
                 >
                    {isPlaying ? <Pause size={24} className="group-hover:text-cyber-primary" /> : <Play size={24} className="ml-1 group-hover:text-cyber-primary" />}
                 </button>

                 <div className="flex-1 min-w-0 bg-gray-900/50 p-3 rounded border border-gray-800">
                    <div className="text-[10px] font-mono text-gray-500 mb-1 tracking-widest">{t.trackInfo}</div>
                    <div className="text-white font-bold text-lg leading-none truncate font-mono">
                        {file ? file.name : t.noTape}
                    </div>
                 </div>

                 {/* Main Action Button */}
                 <button
                    onClick={handleAnalyze}
                    disabled={!file || analysis.isLoading}
                    className={`
                        px-8 py-4 font-black uppercase tracking-widest rounded transition-all flex items-center gap-3 shadow-xl
                        ${!file 
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                            : analysis.isLoading 
                                ? 'bg-cyber-panel border border-cyber-primary text-cyber-primary cursor-wait'
                                : 'bg-gradient-to-r from-cyber-primary to-blue-500 text-black border border-transparent hover:scale-[1.02] hover:shadow-cyber-primary/20'
                        }
                    `}
                 >
                    {analysis.isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span className="text-xs">{t.analyzing}</span>
                        </>
                    ) : (
                        <>
                            <Activity size={20} />
                            <span className="text-xs">{t.startAnalyze}</span>
                        </>
                    )}
                 </button>
            </div>
            
            {analysis.error && (
                <div className="mt-4 p-3 bg-red-950/30 border border-red-500/30 rounded text-red-400 text-xs font-mono">
                    ERROR: {analysis.error}
                </div>
            )}
        </div>

        {/* PROJECTION SCORE */}
        <div className="md:col-span-4 flex flex-col gap-4">
            {analysis.isLoading ? (
                <div className="h-full bg-cyber-panel border border-cyber-primary/20 rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyber-primary/5 animate-pulse"></div>
                    <Loader2 size={48} className="animate-spin text-cyber-primary mb-4 relative z-10" />
                    <div className="font-mono text-center text-cyber-primary relative z-10">
                        <p className="animate-pulse tracking-widest">{t.listening}</p>
                        <p className="text-[10px] opacity-70 mt-2 text-white">{t.calc}</p>
                    </div>
                </div>
            ) : analysis.data ? (
                <div className="h-full bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-cyber-success/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyber-success/10 rounded-full blur-[60px]"></div>
                    
                    <div>
                        <div className="flex items-center gap-2 text-cyber-success mb-3 border-b border-cyber-success/20 pb-2">
                            <TrendingUp size={18} />
                            <span className="font-mono text-[10px] tracking-[0.2em] font-bold">{t.successProj}</span>
                        </div>
                        <div className="text-7xl font-black text-white tracking-tighter tabular-nums">
                            {analysis.data.successScore}<span className="text-xl text-gray-600 font-normal">/100</span>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between text-[10px] font-mono text-gray-400">
                            <span>{t.potential}</span>
                            <span className="text-white">{t.global}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-cyber-success shadow-[0_0_15px_rgba(57,255,20,0.6)]" style={{ width: `${analysis.data.successScore}%` }}></div>
                        </div>
                        <div className="bg-cyber-success/5 border border-cyber-success/10 p-3 rounded text-[11px] text-gray-300 leading-relaxed italic font-mono mt-2">
                            "{analysis.data.commercialViability[lang] || t.noData}"
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full bg-cyber-panel/30 border border-gray-800 border-dashed rounded-2xl flex items-center justify-center group hover:border-gray-700 transition-colors">
                    <div className="text-center text-gray-600 group-hover:text-gray-500">
                        <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="font-mono text-[10px] tracking-widest">{t.awaiting}</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {analysis.data && (
        <div className="animate-in slide-in-from-bottom-10 fade-in duration-700 space-y-6">
            
            {/* TECHNICAL DEEP DIVE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engineering Report */}
                <div className="lg:col-span-2 bg-[#080808] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                         <Sliders size={100} className="text-gray-700" />
                    </div>

                    <div className="flex items-center gap-2 mb-8 border-b border-gray-800 pb-4 relative z-10">
                        <Mic2 className="text-cyber-secondary" size={20} />
                        <h2 className="font-bold text-white tracking-widest text-sm">{t.engReport}</h2>
                        <span className="ml-auto text-[10px] font-mono text-cyber-secondary border border-cyber-secondary/30 px-2 py-1 rounded">{t.approvedBy}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-8">
                             <div>
                                <h3 className="text-cyber-secondary font-mono text-[10px] mb-2 uppercase tracking-wider">{t.mixQual}</h3>
                                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-cyber-secondary pl-4 font-light">
                                    {analysis.data.mixQuality[lang] || t.noData}
                                </p>
                             </div>

                             <div>
                                <h3 className="text-cyber-primary font-mono text-[10px] mb-2 uppercase tracking-wider">{t.vocalChain}</h3>
                                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-cyber-primary pl-4 font-light">
                                    {analysis.data.vocalPresence[lang] || t.noData}
                                </p>
                             </div>
                        </div>

                        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
                             <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-2 bg-gray-900 rounded">
                                    <span className="block text-[10px] text-gray-500 font-mono mb-1">{t.bpm}</span>
                                    <span className="text-xl font-bold text-white">{analysis.data.bpm}</span>
                                </div>
                                <div className="text-center p-2 bg-gray-900 rounded">
                                    <span className="block text-[10px] text-gray-500 font-mono mb-1">{t.key}</span>
                                    <span className="text-xl font-bold text-white">{analysis.data.key}</span>
                                </div>
                                <div className="text-center p-2 bg-gray-900 rounded">
                                    <span className="block text-[10px] text-gray-500 font-mono mb-1">{t.genre}</span>
                                    <span className="text-xs font-bold text-white truncate max-w-full block">{analysis.data.genre}</span>
                                </div>
                             </div>
                             
                             <div className="h-48 mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(analysis.data)}>
                                        <PolarGrid stroke="#333" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 9, fontWeight: 'bold' }} />
                                        <Radar name="Stats" dataKey="A" stroke="#00f0ff" strokeWidth={2} fill="#00f0ff" fillOpacity={0.15} />
                                    </RadarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Strategy */}
                <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 relative flex flex-col">
                     <div className="absolute top-4 right-4 text-yellow-600 opacity-50">
                         <Award size={32} />
                     </div>
                     <h2 className="font-bold text-white tracking-widest text-sm mb-8 border-b border-gray-800 pb-4">{t.campaignVis}</h2>
                     
                     <div className="flex-1 space-y-8">
                         <div>
                             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">{t.targetAud}</span>
                             <div className="flex items-center gap-2">
                                <Globe size={16} className="text-gray-600" />
                                <p className="text-white text-sm font-medium">{analysis.data.targetAudience[lang] || t.noData}</p>
                             </div>
                         </div>
                         
                         <div>
                             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">{t.marketingHook}</span>
                             <div className="bg-cyber-panel border-l-4 border-yellow-500 p-4 rounded-r">
                                 <p className="text-white text-lg font-black italic uppercase leading-tight">
                                     "{analysis.data.marketingCampaign[lang] || t.noData}"
                                 </p>
                             </div>
                         </div>
                         
                         <div className="mt-auto pt-6">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="h-2 w-2 bg-cyber-primary rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-mono text-cyber-primary uppercase">{t.proAdvice}</span>
                             </div>
                             <p className="text-xs text-gray-400 font-mono border border-gray-800 p-3 rounded bg-black/50">
                                 &gt; {t.adviceText}
                             </p>
                         </div>
                     </div>
                </div>
            </div>

            {/* TIMELINE HUB: BENCHMARKING + PRE-RELEASE + POST-RELEASE */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Module 1: Market Benchmarking */}
                <div className="bg-[#050505] border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6 text-purple-500">
                        <Music2 size={24} />
                        <div>
                            <h2 className="font-bold text-white tracking-widest text-sm">{t.comparisonTitle}</h2>
                            <p className="text-[10px] text-gray-500 font-mono">{t.comparisonSubtitle}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {analysis.data.marketComparison?.map((track, idx) => (
                            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{track.title}</h3>
                                        <p className="text-xs text-gray-400">{track.artist}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-mono text-purple-400">{track.similarityScore}% {t.similarity}</span>
                                        <div className="w-20 h-1 bg-gray-800 rounded-full mt-1">
                                            <div className="h-full bg-purple-500" style={{ width: `${track.similarityScore}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-800/50">
                                    <div>
                                        <span className="text-[10px] text-gray-500 font-mono block mb-1">WHY SIMILAR:</span>
                                        <p className="text-[11px] text-gray-300 leading-tight">{track.reason[lang]}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-cyber-primary font-mono block mb-1">{t.differentiator}:</span>
                                        <p className="text-[11px] text-gray-300 leading-tight">{track.differentiator[lang]}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Module 2: PRE-RELEASE PROTOCOL (NEW) */}
                <div className="bg-[#050505] border border-gray-800 rounded-2xl p-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                    <div className="flex items-center gap-2 mb-6 text-yellow-500">
                        <Timer size={24} />
                        <div>
                            <h2 className="font-bold text-white tracking-widest text-sm">{t.preReleaseTitle}</h2>
                            <p className="text-[10px] text-gray-500 font-mono">{t.preReleaseSub}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-yellow-900/10 border border-yellow-900/30 p-4 rounded-lg">
                            <span className="text-[10px] font-mono text-yellow-500 mb-2 block uppercase tracking-wider">{t.assetsReq}</span>
                            <div className="flex flex-wrap gap-2">
                                {analysis.data.preRelease?.assetsNeeded[lang]?.map((asset, i) => (
                                    <span key={i} className="px-2 py-1 bg-black border border-gray-800 rounded text-[10px] text-gray-300">
                                        {asset}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-mono text-gray-500 mb-3 block uppercase tracking-wider">{t.checklist}</span>
                            <ul className="space-y-3">
                                {analysis.data.preRelease?.checklist[lang]?.map((task, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-yellow-500 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-transparent group-hover:bg-yellow-500 transition-colors"></div>
                                        </div>
                                        <span className="text-xs text-gray-300 leading-snug">{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Module 3: Post-Release Protocol */}
                <div className="bg-[#050505] border border-gray-800 rounded-2xl p-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <div className="flex items-center gap-2 mb-6 text-green-500">
                        <CalendarClock size={24} />
                        <div>
                            <h2 className="font-bold text-white tracking-widest text-sm">{t.postReleaseTitle}</h2>
                            <p className="text-[10px] text-gray-500 font-mono">30-DAY EXECUTION PLAN</p>
                        </div>
                    </div>

                    <div className="relative border-l border-gray-800 ml-3 space-y-6">
                        {/* Week 1 */}
                        <div className="pl-6 relative">
                            <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                {t.week1} <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[10px] rounded border border-green-900">GO</span>
                            </h3>
                            <ul className="space-y-2">
                                {analysis.data.postReleaseSchedule?.week1[lang]?.map((task, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                        <CheckCircle2 size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Week 2 */}
                        <div className="pl-6 relative">
                             <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-gray-600"></div>
                             <h3 className="text-sm font-bold text-gray-300 mb-2">{t.week2}</h3>
                             <ul className="space-y-2">
                                {analysis.data.postReleaseSchedule?.week2[lang]?.map((task, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                        <ArrowUpRight size={14} className="text-gray-700 mt-0.5 flex-shrink-0" />
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                         {/* Month 1 */}
                         <div className="pl-6 relative">
                             <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-gray-600"></div>
                             <h3 className="text-sm font-bold text-gray-300 mb-2">{t.month1}</h3>
                             <ul className="space-y-2">
                                {analysis.data.postReleaseSchedule?.month1[lang]?.map((task, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                        <Activity size={14} className="text-gray-700 mt-0.5 flex-shrink-0" />
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* DETAILED SOCIAL STRATEGY */}
            <div>
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-cyber-accent/10 rounded">
                        <Share2 className="text-cyber-accent" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">{t.gtmStrat}</h2>
                        <p className="text-[10px] text-gray-500 font-mono">SOCIAL MEDIA DEPLOYMENT PROTOCOL</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     
                     {/* TikTok - Keeping Fast & Trend Focused */}
                     <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 hover:border-cyber-primary/50 transition-all duration-300 group">
                         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-900">
                             <div className="flex items-center gap-2 text-gray-400 group-hover:text-white">
                                 <Smartphone size={18} />
                                 <span className="font-bold text-xs tracking-wider">{t.tiktokTrend}</span>
                             </div>
                             <Disc className="text-gray-800 group-hover:text-cyber-primary group-hover:animate-spin" size={20} />
                         </div>
                         <p className="text-xs text-gray-300 mb-6 leading-relaxed font-light">{analysis.data.socialStrategy?.tiktok[lang] || t.noData}</p>
                         <div className="bg-gray-900/80 rounded p-4 border border-gray-800">
                             <span className="text-[10px] font-mono text-cyber-primary block mb-2 tracking-widest">{t.viralHooks}</span>
                             <ul className="text-[11px] text-gray-400 space-y-2 list-disc pl-4 font-mono">
                                 {analysis.data.viralHooks[lang]?.slice(0, 3).map((hook, i) => (
                                     <li key={i}>{hook}</li>
                                 )) || <li>{t.noData}</li>}
                             </ul>
                         </div>
                     </div>

                     {/* Instagram - ART DIRECTION MODE */}
                     <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 group">
                         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-900">
                             <div className="flex items-center gap-2 text-gray-400 group-hover:text-pink-500">
                                 <Instagram size={18} />
                                 <span className="font-bold text-xs tracking-wider">{t.instaAes}</span>
                             </div>
                             <Palette size={18} className="text-gray-700 group-hover:text-pink-500" />
                         </div>
                         
                         <div className="space-y-4">
                             <div>
                                 <span className="text-[10px] text-gray-500 font-mono block mb-1">{t.contentPillar}:</span>
                                 <p className="text-xs text-gray-300 leading-relaxed font-light">
                                     {analysis.data.socialStrategy?.instagram.concept[lang] || t.noData}
                                 </p>
                             </div>
                             <div className="bg-pink-900/10 border border-pink-900/30 p-3 rounded">
                                 <span className="text-[10px] text-pink-500 font-mono block mb-1">{t.visualTech}:</span>
                                 <p className="text-[11px] text-pink-100/80 leading-relaxed italic">
                                     "{analysis.data.socialStrategy?.instagram.artDirection[lang] || t.noData}"
                                 </p>
                             </div>
                         </div>
                     </div>

                     {/* YouTube - PRODUCTION MODE */}
                     <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group">
                         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-900">
                             <div className="flex items-center gap-2 text-gray-400 group-hover:text-red-500">
                                 <Youtube size={18} />
                                 <span className="font-bold text-xs tracking-wider">{t.ytContent}</span>
                             </div>
                             <Clapperboard size={18} className="text-gray-700 group-hover:text-red-500" />
                         </div>

                         <div className="space-y-4">
                             <div>
                                 <span className="text-[10px] text-gray-500 font-mono block mb-1">{t.contentPillar}:</span>
                                 <p className="text-xs text-gray-300 leading-relaxed font-light">
                                     {analysis.data.socialStrategy?.youtube.concept[lang] || t.noData}
                                 </p>
                             </div>
                             <div className="bg-red-900/10 border border-red-900/30 p-3 rounded">
                                 <span className="text-[10px] text-red-500 font-mono block mb-1">{t.visualTech}:</span>
                                 <p className="text-[11px] text-red-100/80 leading-relaxed italic">
                                     "{analysis.data.socialStrategy?.youtube.artDirection[lang] || t.noData}"
                                 </p>
                             </div>
                         </div>
                     </div>

                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SongAnalysis;