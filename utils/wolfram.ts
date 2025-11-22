import { RuleSet } from '../types';

// Using a flattened array for the 2D grid for performance [y * width + x]
export type Grid2D = Uint8Array;

/**
 * Computes the next generation of a 2D cellular automaton.
 * Uses Moore Neighborhood (8 neighbors).
 */
export const computeNextGeneration2D = (
  currentGrid: Grid2D, 
  size: number, 
  born: number[], 
  survive: number[]
): Grid2D => {
  const nextGrid = new Uint8Array(size * size);
  
  // Lookup tables for speed
  const bornMap = new Uint8Array(9);
  const surviveMap = new Uint8Array(9);
  born.forEach(b => bornMap[b] = 1);
  survive.forEach(s => surviveMap[s] = 1);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      
      // Calculate neighbors with wrap-around (toroidal)
      let neighbors = 0;
      
      // Neighbor offsets: -1, 0, 1
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const ny = (y + dy + size) % size;
          const nx = (x + dx + size) % size;
          
          if (currentGrid[ny * size + nx]) {
            neighbors++;
          }
        }
      }

      const currentState = currentGrid[idx];
      
      if (currentState === 1) {
        nextGrid[idx] = surviveMap[neighbors];
      } else {
        nextGrid[idx] = bornMap[neighbors];
      }
    }
  }

  return nextGrid;
};

export const generateInitialGrid = (size: number, mode: 'center' | 'random' | 'cross'): Grid2D => {
  const grid = new Uint8Array(size * size);
  
  if (mode === 'center') {
    const center = Math.floor(size / 2);
    grid[center * size + center] = 1;
    // Make a small 2x2 block to ensure robust growth for some rules
    grid[center * size + center + 1] = 1;
    grid[(center + 1) * size + center] = 1;
    grid[(center + 1) * size + center + 1] = 1;
  } else if (mode === 'random') {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() > 0.7 ? 1 : 0; // Sparse random
    }
  } else if (mode === 'cross') {
    const center = Math.floor(size / 2);
    for (let i = 0; i < size; i++) {
      grid[center * size + i] = 1;
      grid[i * size + center] = 1;
    }
  }
  
  return grid;
};