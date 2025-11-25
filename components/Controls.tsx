import React from 'react';
import { Play, Pause, RefreshCw, Box, Grid, Palette, Info, Layers, Eye, Shuffle, Binary, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
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

// === LIFE-LIKE PRESETS ===
const PRESET_LIFE_RULES: RuleSet[] = [
  { name: 'Life', type: 'totalistic', born: [3], survive: [3, 4], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'HighLife', type: 'totalistic', born: [3, 6], survive: [3, 4], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'Day & Night', type: 'totalistic', born: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'Seeds', type: 'totalistic', born: [2], survive: [], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'Morley', type: 'totalistic', born: [3, 6, 8], survive: [2, 4, 5], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'Anneal', type: 'totalistic', born: [4, 6, 7, 8], survive: [3, 5, 6, 7, 8], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: 'Diamoeba', type: 'totalistic', born: [3, 5, 6, 7, 8], survive: [5, 6, 7, 8], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: '2x2', type: 'totalistic', born: [3, 6], survive: [1, 2, 5], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
  { name: '34 Life', type: 'totalistic', born: [3, 4], survive: [3, 4], ruleH: 30, enabledH: true, ruleV: 30, enabledV: true, ruleD1: 0, enabledD1: false, ruleD2: 0, enabledD2: false },
];

// === WOLFRAM PRESETS (INDIVIDUAL) ===
const WOLFRAM_MAGIC_NUMBERS = [
  { val: 30, label: 'Chaos' },
  { val: 54, label: 'Parity' },
  { val: 60, label: 'Tri' },
  { val: 90, label: 'Fractal' },
  { val: 106, label: 'Streak' },
  { val: 110, label: 'Complex' },
  { val: 126, label: 'Tri-2' },
  { val: 150, label: 'Symm' },
];

// === GLOBAL WOLFRAM COMBINATIONS ===
const WOLFRAM_COMBOS = [
  { 
    name: 'Chaos Fabric', 
    config: { enabledH: true, ruleH: 30, enabledV: true, ruleV: 30, enabledD1: false, enabledD2: false } 
  },
  { 
    name: 'Sierpinski Mesh', 
    config: { enabledH: true, ruleH: 90, enabledV: true, ruleV: 90, enabledD1: false, enabledD2: false } 
  },
  { 
    name: 'Textile', 
    config: { enabledH: true, ruleH: 30, enabledV: true, ruleV: 90, enabledD1: false, enabledD2: false } 
  },
  { 
    name: 'Crystal Box', 
    config: { enabledH: true, ruleH: 1, enabledV: true, ruleV: 1, enabledD1: true, ruleD1: 1, enabledD2: true, ruleD2: 1 } 
  },
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
      newArr = [...currentArr, val].sort((a, b) => a - b);
    }
    
    setRule({
      ...rule,
      name: 'Custom',
      type: 'totalistic',
      [type]: newArr
    });
  };

  const randomizeTotalistic = () => {
    // Generate random subset for born and survive
    const rBorn = [0,1,2,3,4,5,6,7,8,9].filter(() => Math.random() > 0.7);
    const rSurvive = [0,1,2,3,4,5,6,7,8,9].filter(() => Math.random() > 0.6);
    
    setRule({
      ...rule,
      name: 'Random Life',
      type: 'totalistic',
      born: rBorn,
      survive: rSurvive
    });
    onReset();
  };

  const updateWolframAxis = (axis: 'H' | 'V' | 'D1' | 'D2', updates: Partial<RuleSet>) => {
     setRule({
       ...rule,
       type: 'wolfram',
       name: 'Custom W',
       ...updates
     });
  };

  const randomizeWolfram = () => {
    setRule({
      ...rule,
      type: 'wolfram',
      name: 'Random W',
      ruleH: rule.enabledH ? Math.floor(Math.random() * 256) : rule.ruleH,
      ruleV: rule.enabledV ? Math.floor(Math.random() * 256) : rule.ruleV,
      ruleD1: rule.enabledD1 ? Math.floor(Math.random() * 256) : rule.ruleD1,
      ruleD2: rule.enabledD2 ? Math.floor(Math.random() * 256) : rule.ruleD2,
    });
    onReset();
  };

  const applyWolframCombo = (combo: typeof WOLFRAM_COMBOS[0]) => {
    setRule({
      ...rule,
      type: 'wolfram',
      name: combo.name,
      ...combo.config
    } as RuleSet); 
    onReset();
  };

  const renderWolframControl = (
    axisKey: 'H' | 'V' | 'D1' | 'D2', 
    label: string
  ) => {
    const ruleVal = rule[`rule${axisKey}` as keyof RuleSet] as number;
    const enabled = rule[`enabled${axisKey}` as keyof RuleSet] as boolean;

    const adjustValue = (delta: number) => {
      const newVal = Math.max(0, Math.min(255, ruleVal + delta));
      updateWolframAxis(axisKey, { [`rule${axisKey}`]: newVal });
    };

    return (
      <div className={`p-2 rounded-lg border flex flex-col gap-2 transition-all overflow-hidden ${enabled ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
        
        {/* Header: Toggle + Label + Input */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <input 
              type="checkbox" 
              checked={enabled}
              onChange={(e) => updateWolframAxis(axisKey, { [`enabled${axisKey}`]: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-0 cursor-pointer shrink-0"
            />
            <span className={`text-[11px] font-mono font-bold whitespace-nowrap truncate ${enabled ? 'text-indigo-400' : 'text-slate-500'}`}>
               {label}
            </span>
          </div>
          
          <input 
            type="number" 
            min="0" max="255" 
            value={ruleVal}
            disabled={!enabled}
            onChange={(e) => updateWolframAxis(axisKey, { [`rule${axisKey}`]: Math.max(0, Math.min(255, parseInt(e.target.value) || 0)) })}
            className="w-12 h-8 bg-slate-950 border border-slate-700 rounded text-center font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        
        {/* Slider with Steps */}
        <div className="flex items-center gap-1 w-full">
          <button 
             disabled={!enabled} 
             onClick={() => adjustValue(-1)}
             className="text-slate-500 hover:text-white disabled:opacity-30 p-1 shrink-0"
          >
            <ChevronLeft size={14} />
          </button>
          
          <input 
            type="range" min="0" max="255" 
            value={ruleVal} 
            disabled={!enabled}
            onChange={(e) => updateWolframAxis(axisKey, { [`rule${axisKey}`]: parseInt(e.target.value) })}
            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:accent-slate-600 min-w-0"
          />
          
          <button 
             disabled={!enabled} 
             onClick={() => adjustValue(1)}
             className="text-slate-500 hover:text-white disabled:opacity-30 p-1 shrink-0"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        
        {/* Presets Chips */}
        <div className="flex flex-wrap gap-1 justify-center">
           {WOLFRAM_MAGIC_NUMBERS.map(m => {
             const isSelected = ruleVal === m.val;
             return (
               <button
                 key={m.val}
                 disabled={!enabled}
                 onClick={() => updateWolframAxis(axisKey, { [`rule${axisKey}`]: m.val })}
                 className={`px-1.5 py-0.5 text-[9px] font-mono rounded border transition-colors ${
                   isSelected 
                     ? 'bg-indigo-500/30 border-indigo-500 text-indigo-300' 
                     : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                 } disabled:opacity-30`}
                 title={m.label}
               >
                 {m.val}
               </button>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 w-full max-w-md overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <Box className="text-indigo-400 w-5 h-5" />
          <h1 className="text-lg font-bold tracking-tight text-white">Wolfram 3D</h1>
        </div>
        <p className="text-[11px] text-slate-400 tracking-wide uppercase">Automata Explorer</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-5 space-y-6">
          
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                isPlaying 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
              {isPlaying ? 'Stop' : 'Run'}
            </button>
            
            <button
              onClick={onReset}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-300"
              title="Reset Grid"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-800/50 p-1 rounded-lg flex gap-1">
            <button 
              onClick={() => setRule({...rule, type: 'totalistic'})}
              className={`flex-1 py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all ${
                rule.type === 'totalistic' 
                ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Activity size={14} /> Life-Like
            </button>
            <button 
               onClick={() => setRule({...rule, type: 'wolfram'})}
               className={`flex-1 py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all ${
                rule.type === 'wolfram' 
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Binary size={14} /> Wolfram
            </button>
          </div>

          {/* DYNAMIC SETTINGS */}
          <div className="space-y-5">
            
            {rule.type === 'totalistic' ? (
              /* --- TOTALISTIC CONTROLS --- */
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Neighborhood Rules</span>
                  <button 
                     onClick={randomizeTotalistic} 
                     className="text-[10px] font-bold uppercase flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Shuffle size={12} /> Randomize
                  </button>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 space-y-4">
                   <div>
                     <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase block mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Born (Sum 0-9)
                     </span>
                     <div className="flex flex-wrap gap-1">
                       {[0,1,2,3,4,5,6,7,8,9].map(n => (
                         <button 
                           key={`b-${n}`}
                           onClick={() => toggleRuleBit('born', n)}
                           className={`w-6 h-6 text-[10px] font-bold rounded border transition-all ${
                             rule.born.includes(n) 
                               ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-[0_0_6px_rgba(16,185,129,0.4)]' 
                               : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-700'
                           }`}
                         >
                           {n}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div>
                     <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Survive (Sum 0-9)
                     </span>
                     <div className="flex flex-wrap gap-1">
                       {[0,1,2,3,4,5,6,7,8,9].map(n => (
                         <button 
                           key={`s-${n}`}
                           onClick={() => toggleRuleBit('survive', n)}
                           className={`w-6 h-6 text-[10px] font-bold rounded border transition-all ${
                             rule.survive.includes(n) 
                               ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_6px_rgba(59,130,246,0.4)]' 
                               : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-700'
                           }`}
                         >
                           {n}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>

                {/* Presets Grid */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Presets</span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_LIFE_RULES.map((r) => {
                      const isActive = r.name === rule.name;
                      return (
                        <button
                          key={r.name}
                          onClick={() => { setRule(r); onReset(); }}
                          className={`px-3 py-2 text-xs rounded border text-left transition-all flex justify-between items-center group ${
                             isActive 
                             ? 'bg-slate-700 border-slate-500 text-white shadow-sm' 
                             : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <span>{r.name}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
               /* --- WOLFRAM CONTROLS --- */
              <div className="space-y-5 animate-in fade-in duration-300">
                 
                 <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Axes Configuration</span>
                  <button 
                     onClick={randomizeWolfram} 
                     className="text-[10px] font-bold uppercase flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Shuffle size={12} /> Randomize
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   {renderWolframControl('H', '- Horiz.')}
                   {renderWolframControl('V', '| Vertic.')}
                   {renderWolframControl('D2', '/ Diag1')}
                   {renderWolframControl('D1', '\\ Diag2')}
                </div>

                 {/* Global Combinations */}
                 <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Combined Presets</span>
                    <div className="grid grid-cols-2 gap-2">
                       {WOLFRAM_COMBOS.map(combo => (
                         <button
                           key={combo.name}
                           onClick={() => applyWolframCombo(combo)}
                           className="px-3 py-2 text-xs rounded border bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-indigo-200 text-left transition-all"
                         >
                           {combo.name}
                         </button>
                       ))}
                    </div>
                 </div>

              </div>
            )}

            <hr className="border-slate-800/80" />

            {/* Initial State */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Seed</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg">
                {(['center', 'random', 'cross'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setInitialStateMode(mode); onReset(); }}
                    className={`py-1.5 text-[10px] font-bold uppercase tracking-wide rounded ${
                      initialStateMode === mode 
                      ? 'bg-slate-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Settings */}
            <div className="space-y-4 pt-2">
               {/* Grid Size */}
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                   <span>GRID SIZE</span>
                   <span>{gridSize}px</span>
                 </div>
                 <input
                  type="range"
                  min="20"
                  max="100"
                  step="2"
                  value={gridSize}
                  onChange={(e) => { setGridSize(Number(e.target.value)); onReset(); }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                />
               </div>

               {/* Speed */}
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                   <span>SIM SPEED</span>
                   <span>{(speed * 10)}%</span>
                 </div>
                 <input
                  type="range"
                  min="1"
                  max="20"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                />
               </div>

               {/* Opacity */}
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                   <span>OPACITY</span>
                   <span>{Math.round(opacity * 100)}%</span>
                 </div>
                 <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400"
                />
               </div>
            </div>

            {/* Theme */}
            <div className="space-y-2 pt-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color Palette</span>
               <div className="grid grid-cols-6 gap-2">
                 {Object.keys(PALETTES).map((t) => (
                   <button
                     key={t}
                     onClick={() => setTheme(t as ThemePalette)}
                     className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 hover:shadow-lg ${
                       theme === t ? 'border-white ring-2 ring-white/20' : 'border-transparent opacity-80 hover:opacity-100'
                     }`}
                     style={{ background: PALETTES[t as ThemePalette].cell }}
                     title={t}
                   />
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-500 flex justify-between shrink-0">
         <span>Z-INDEX: {generation}</span>
         <span className="truncate max-w-[120px] uppercase">
            {rule.type === 'totalistic' ? 'Life-Like' : 'Wolfram'}
         </span>
      </div>
    </div>
  );
};

export default Controls;