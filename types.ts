export enum ThemePalette {
  Matrix = 'Matrix',
  Sunset = 'Sunset',
  Ocean = 'Ocean',
  Mono = 'Mono',
  Cyberpunk = 'Cyberpunk',
  Lava = 'Lava'
}

export type RuleType = 'totalistic' | 'wolfram';

export interface RuleSet {
  name: string;
  type: RuleType;
  // For Totalistic (0-9 neighbors now, including self)
  born: number[];    // Sum of 9 cells required to be born
  survive: number[]; // Sum of 9 cells required to survive
  
  // For Wolfram Elementary (Cross-section style)
  ruleH: number;     // 0-255 Horizontal Rule
  enabledH: boolean; 
  
  ruleV: number;     // 0-255 Vertical Rule
  enabledV: boolean;
  
  ruleD1: number;    // 0-255 Diagonal \ (Main)
  enabledD1: boolean;
  
  ruleD2: number;    // 0-255 Diagonal / (Anti)
  enabledD2: boolean;
}

export interface AppState {
  rule: RuleSet;
  isPlaying: boolean;
  generation: number;
  gridSize: number; // Width/Height of the plane
  speed: number; 
  theme: ThemePalette;
  initialStateMode: 'center' | 'random' | 'cross';
}

export const PALETTES: Record<ThemePalette, { background: string; cell: string; glow: string }> = {
  [ThemePalette.Matrix]: { background: '#000000', cell: '#00ff41', glow: '#003b00' },
  [ThemePalette.Sunset]: { background: '#1a0b1a', cell: '#ff9900', glow: '#b02e4c' },
  [ThemePalette.Ocean]: { background: '#020617', cell: '#38bdf8', glow: '#1e3a8a' },
  [ThemePalette.Mono]: { background: '#f8fafc', cell: '#0f172a', glow: '#94a3b8' },
  [ThemePalette.Cyberpunk]: { background: '#050505', cell: '#d946ef', glow: '#701a75' },
  [ThemePalette.Lava]: { background: '#0f0505', cell: '#ef4444', glow: '#7f1d1d' },
};
