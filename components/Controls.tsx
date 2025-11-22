import React from 'react';
import { Play, Pause, RefreshCw, Box, Grid, Palette, Info, Layers, Eye } from 'lucide-react';
import { ThemePalette, PALETTES, RuleSet } from '../types';

interface ControlsProps {
  rule: RuleSet;
  setRule: (r: RuleSet) => void;
  isPlaying: boolean;
  setIsPlaying: (b: boolean) => void;
  onReset: () => void;
  gridSize: number;
  setGridSize: (s: number) => void;
  speed: number;
  setSpeed: (s: number) => void;
  opacity: number;
  setOpacity: (o: number) => void;
  theme: ThemePalette;
  setTheme: (t: ThemePalette) => void;
  initialStateMode: 'center' | 'random' | 'cross';
  setInitialStateMode: (m: 'center' | 'random' | 'cross') => void;
  generation: number;
}

const PRESET_RULES: RuleSet[] = [
  { name: 'Life (B3/S23)', born: [3], survive: [2, 3] },
  { name: 'HighLife (B36/S23)', born: [3, 6], survive: [2, 3] },
  { name: 'Day & Night', born: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8] },
  { name: 'Seeds (B2/S)', born: [2], survive: [] },
  { name: 'Coral (B3/S45678)', born: [3], survive: [4, 5, 6, 7, 8] },
  { name: '3D Builder', born: [2, 6], survive: [5] }, // Custom fun one
];

const Controls: React.FC<ControlsProps> = ({
  rule,
  setRule,
  isPlaying,
  setIsPlaying,
  onReset,
  gridSize,
  setGridSize,
  speed,
  setSpeed,
  opacity,
  setOpacity,
  theme,
  setTheme,
  initialStateMode,
  setInitialStateMode,
  generation,
}) => {

  const toggleRuleBit = (type: 'born' | 'survive', val: number) => {
    const currentArr = type === 'born' ? rule.born : rule.survive;
    let newArr;
    if (currentArr.includes(val)) {
      newArr = currentArr.filter(n => n !== val);
    } else {
      newArr = [...currentArr, val].sort();
    }
    
    setRule({
      ...rule,
      name: 'Custom',
      [type]: newArr
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 w-full max-w-md overflow-y-auto shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-2">
          <Box className="text-indigo-400 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-white">Wolfram 3D</h1>
        </div>
        <p className="text-xs text-slate-400">2D Cellular Automata in Spacetime</p>
      </div>

      {/* Main Controls */}
      <div className="p-6 space-y-8 flex-1">
        
        {/* Playback */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              isPlaying 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
            {isPlaying ? 'Stop' : 'Simulate'}
          </button>
          
          <button
            onClick={onReset}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-300"
            title="Reset Canvas"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Rule Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Info size={14} className="text-slate-500" /> Rules (Neighbors)
            </label>
          </div>
          
          {/* B/S Toggles */}
          <div className="bg-slate-800/50 p-3 rounded-lg space-y-3">
             {/* Born */}
             <div>
               <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Born (if dead)</span>
               <div className="flex gap-1 flex-wrap">
                 {[1,2,3,4,5,6,7,8].map(n => (
                   <button 
                     key={`b-${n}`}
                     onClick={() => toggleRuleBit('born', n)}
                     className={`w-7 h-7 text-xs font-bold rounded border transition-all ${
                       rule.born.includes(n) 
                         ? 'bg-emerald-500 border-emerald-400 text-slate-900' 
                         : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                     }`}
                   >
                     {n}
                   </button>
                 ))}
               </div>
             </div>
             {/* Survive */}
             <div>
               <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Survive (if alive)</span>
               <div className="flex gap-1 flex-wrap">
                 {[1,2,3,4,5,6,7,8].map(n => (
                   <button 
                     key={`s-${n}`}
                     onClick={() => toggleRuleBit('survive', n)}
                     className={`w-7 h-7 text-xs font-bold rounded border transition-all ${
                       rule.survive.includes(n) 
                         ? 'bg-blue-500 border-blue-400 text-white' 
                         : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                     }`}
                   >
                     {n}
                   </button>
                 ))}
               </div>
             </div>
          </div>

          {/* Presets */}
          <div>
            <span className="text-xs text-slate-500 mb-2 block">Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_RULES.map((r) => (
                <button
                  key={r.name}
                  onClick={() => { setRule(r); onReset(); }}
                  className={`px-3 py-2 text-xs rounded border transition-all text-left ${
                    JSON.stringify(rule.born) === JSON.stringify(r.born) && JSON.stringify(rule.survive) === JSON.stringify(r.survive)
                      ? 'bg-slate-700 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Initial State */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Initial Plane</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg">
            {(['center', 'random', 'cross'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setInitialStateMode(mode); onReset(); }}
                className={`py-1.5 text-xs font-medium rounded capitalize ${
                  initialStateMode === mode ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Visual Settings */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <Grid size={16} className="text-slate-500" />
             <span className="text-sm font-semibold text-slate-300">Visuals & Grid</span>
           </div>

           {/* Grid Size */}
           <div>
             <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span>Plane Size</span>
               <span>{gridSize}x{gridSize}</span>
             </div>
             <input
              type="range"
              min="20"
              max="100"
              step="2"
              value={gridSize}
              onChange={(e) => { setGridSize(Number(e.target.value)); onReset(); }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
           </div>

           {/* Speed */}
           <div>
             <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span className="flex items-center gap-1"><Layers size={12} /> Growth Speed</span>
               <span>{(speed * 10)}%</span>
             </div>
             <input
              type="range"
              min="1"
              max="20"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
           </div>

           {/* Opacity */}
           <div>
             <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span className="flex items-center gap-1"><Eye size={12} /> Opacity</span>
               <span>{Math.round(opacity * 100)}%</span>
             </div>
             <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
           </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
           <div className="flex items-center gap-2">
             <Palette size={16} className="text-slate-500" />
             <span className="text-sm font-semibold text-slate-300">Theme</span>
           </div>
           <div className="grid grid-cols-6 gap-2">
             {Object.keys(PALETTES).map((t) => (
               <button
                 key={t}
                 onClick={() => setTheme(t as ThemePalette)}
                 className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 ${
                   theme === t ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'
                 }`}
                 style={{ background: PALETTES[t as ThemePalette].cell }}
                 title={t}
               />
             ))}
           </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 text-xs font-mono text-slate-500 flex justify-between">
         <span>HEIGHT: {generation}</span>
         <span>B{rule.born.join('')}/S{rule.survive.join('')}</span>
      </div>
    </div>
  );
};

export default Controls;