import React, { useState, useCallback } from 'react';
import Controls from './components/Controls';
import Automata3DViewer from './components/AutomataCanvas';
import { ThemePalette, RuleSet } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [rule, setRule] = useState<RuleSet>({
    name: 'Life', born: [3], survive: [2, 3] 
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [gridSize, setGridSize] = useState(50);
  const [speed, setSpeed] = useState(2);
  const [opacity, setOpacity] = useState(0.9);
  const [theme, setTheme] = useState<ThemePalette>(ThemePalette.Matrix);
  const [initialStateMode, setInitialStateMode] = useState<'center' | 'random' | 'cross'>('random');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleReset = useCallback(() => {
    setGeneration(0);
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative">
      
      {/* Mobile Toggle */}
      <button 
        className="absolute top-4 right-4 z-50 p-2 bg-slate-800 text-white rounded-full shadow-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:w-96 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Controls 
          rule={rule}
          setRule={setRule}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onReset={handleReset}
          gridSize={gridSize}
          setGridSize={setGridSize}
          speed={speed}
          setSpeed={setSpeed}
          opacity={opacity}
          setOpacity={setOpacity}
          theme={theme}
          setTheme={setTheme}
          initialStateMode={initialStateMode}
          setInitialStateMode={setInitialStateMode}
          generation={generation}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 h-full relative bg-slate-900 flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <Automata3DViewer
            rule={rule}
            gridSize={gridSize}
            isPlaying={isPlaying}
            theme={theme}
            initialStateMode={initialStateMode}
            speed={speed}
            opacity={opacity}
            onGenerationChange={setGeneration}
            triggerReset={resetTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default App;