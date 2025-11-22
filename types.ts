export enum ThemePalette {
  Matrix = 'Matrix',
  Sunset = 'Sunset',
  Ocean = 'Ocean',
  Mono = 'Mono',
  Cyberpunk = 'Cyberpunk',
  Lava = 'Lava'
}

export interface RuleSet {
  name: string;
  born: number[];    // Number of neighbors required to be born (0->1)
  survive: number[]; // Number of neighbors required to survive (1->1)
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