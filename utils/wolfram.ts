import { RuleSet } from '../types';

// Using a flattened array for the 2D grid for performance [y * width + x]
export type Grid2D = Uint8Array;

/**
 * Computes the next generation of a 2D cellular automaton.
 * Supports:
 * 1. Totalistic: Sum of 9 neighbors (including self)
 * 2. Wolfram: Cross-section Elementary Rules (H, V, D1, D2)
 */
export const computeNextGeneration2D = (
  currentGrid: Grid2D, 
  size: number, 
  rule: RuleSet
): Grid2D => {
  const nextGrid = new Uint8Array(size * size);
  
  // === TOTALISTIC MODE (9-cell sum) ===
  if (rule.type === 'totalistic') {
    // Maps for 0-9 sum
    const bornMap = new Uint8Array(10);
    const surviveMap = new Uint8Array(10);
    rule.born.forEach(b => bornMap[b] = 1);
    rule.survive.forEach(s => surviveMap[s] = 1);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        
        let sum = 0;
        // Check 3x3 block including center
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = (y + dy + size) % size;
            const nx = (x + dx + size) % size;
            
            if (currentGrid[ny * size + nx]) {
              sum++;
            }
          }
        }

        const currentState = currentGrid[idx];
        
        // If cell is currently ALIVE (1), use survive rules on the sum (which includes itself)
        // If cell is currently DEAD (0), use born rules on the sum (which is just neighbors)
        if (currentState === 1) {
          nextGrid[idx] = surviveMap[sum];
        } else {
          nextGrid[idx] = bornMap[sum];
        }
      }
    }
  } 
  
  // === WOLFRAM MODE (Elementary 1D rules applied to 4 axes) ===
  else if (rule.type === 'wolfram') {
    const { 
      ruleH, enabledH, 
      ruleV, enabledV, 
      ruleD1, enabledD1, 
      ruleD2, enabledD2 
    } = rule;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        const center = currentGrid[idx];
        let result = 0;

        // --- Horizontal (Left-Center-Right) ---
        if (enabledH) {
          const left = currentGrid[y * size + ((x - 1 + size) % size)];
          const right = currentGrid[y * size + ((x + 1 + size) % size)];
          const val = (left << 2) | (center << 1) | right;
          if ((ruleH >> val) & 1) result = 1;
        }

        // --- Vertical (Top-Center-Bottom) ---
        if (result === 0 && enabledV) {
          const top = currentGrid[((y - 1 + size) % size) * size + x];
          const bottom = currentGrid[((y + 1 + size) % size) * size + x];
          const val = (top << 2) | (center << 1) | bottom;
          if ((ruleV >> val) & 1) result = 1;
        }

        // --- Diagonal Main \ (TL-Center-BR) ---
        if (result === 0 && enabledD1) {
          const tl = currentGrid[((y - 1 + size) % size) * size + ((x - 1 + size) % size)];
          const br = currentGrid[((y + 1 + size) % size) * size + ((x + 1 + size) % size)];
          const val = (tl << 2) | (center << 1) | br;
          if ((ruleD1 >> val) & 1) result = 1;
        }

        // --- Diagonal Anti / (TR-Center-BL) ---
        if (result === 0 && enabledD2) {
          const tr = currentGrid[((y - 1 + size) % size) * size + ((x + 1 + size) % size)];
          const bl = currentGrid[((y + 1 + size) % size) * size + ((x - 1 + size) % size)];
          const val = (tr << 2) | (center << 1) | bl;
          if ((ruleD2 >> val) & 1) result = 1;
        }

        nextGrid[idx] = result;
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
  } else if (mode === 'random') {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() > 0.8 ? 1 : 0; // Sparse random
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
