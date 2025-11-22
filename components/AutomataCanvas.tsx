import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ThemePalette, PALETTES, RuleSet } from '../types';
import { computeNextGeneration2D, generateInitialGrid, Grid2D } from '../utils/wolfram';

interface Automata3DProps {
  rule: RuleSet;
  gridSize: number; // WxH of the plane
  isPlaying: boolean;
  theme: ThemePalette;
  initialStateMode: 'center' | 'random' | 'cross';
  speed: number;
  opacity: number;
  onGenerationChange: (gen: number) => void;
  triggerReset: number;
}

// Maximum number of layers to keep in history (Z-axis height)
const MAX_LAYERS = 60;

const SimulationScene: React.FC<Automata3DProps> = ({
  rule,
  gridSize,
  isPlaying,
  theme,
  initialStateMode,
  speed,
  opacity,
  onGenerationChange,
  triggerReset,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // We store the history of grids. Each grid is a 2D slice of time.
  // We treat index 0 as the oldest (bottom) and index length-1 as newest (top).
  const historyRef = useRef<Grid2D[]>([]);
  const stateRef = useRef({
    accumulatedTime: 0,
    frameCount: 0,
  });

  const palette = PALETTES[theme];
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Initialize Simulation
  useEffect(() => {
    historyRef.current = [generateInitialGrid(gridSize, initialStateMode)];
    stateRef.current.frameCount = 0;
    onGenerationChange(0);
  }, [gridSize, initialStateMode, triggerReset, onGenerationChange]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!isPlaying) return;

    stateRef.current.accumulatedTime += delta;
    // Speed controls how fast we add layers. 
    // At speed 1, maybe 10 layers per second.
    // Speed 1-50 mapping.
    const updateInterval = 1 / (speed * 2); 

    if (stateRef.current.accumulatedTime > updateInterval) {
      stateRef.current.accumulatedTime = 0;

      // Compute Next Layer
      const currentLayer = historyRef.current[historyRef.current.length - 1];
      const nextLayer = computeNextGeneration2D(currentLayer, gridSize, rule.born, rule.survive);
      
      historyRef.current.push(nextLayer);
      
      // Cap history size to create a scrolling effect or fixed cube
      if (historyRef.current.length > MAX_LAYERS) {
         historyRef.current.shift(); // Remove bottom layer
      } else {
         stateRef.current.frameCount++;
      }

      onGenerationChange(stateRef.current.frameCount);
    }
  });

  // Rendering Logic (Runs every frame to update instances)
  useFrame(() => {
    if (!meshRef.current) return;

    let instanceIdx = 0;
    const history = historyRef.current;
    
    // Center the cube
    const offset = gridSize / 2;

    for (let z = 0; z < history.length; z++) {
      const grid = history[z];
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === 1) {
          const x = (i % gridSize) - offset;
          const y = Math.floor(i / gridSize) - offset;
          
          // In 3D space: X is width, Z is depth (Y in grid), Y is height (Time)
          // Let's map Time to Y-axis (Vertical Stack)
          
          dummy.position.set(x, z - (MAX_LAYERS/2), y);
          
          // Scale cells slightly down for grid effect
          dummy.scale.set(0.9, 0.9, 0.9);
          dummy.updateMatrix();
          
          meshRef.current.setMatrixAt(instanceIdx, dummy.matrix);
          
          instanceIdx++;
        }
      }
    }

    meshRef.current.count = instanceIdx;
    if (meshRef.current.instanceMatrix) {
       meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Material Color & Opacity Update
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(palette.cell);
      materialRef.current.emissive.set(palette.glow);
      materialRef.current.emissiveIntensity = 0.9;
      materialRef.current.opacity = opacity;
      materialRef.current.transparent = opacity < 1.0;
    }
  }, [theme, palette, opacity]);

  return (
    <group>
      <instancedMesh 
        ref={meshRef} 
        key={`mesh-${gridSize}`} // Force re-creation on grid size change
        args={[undefined, undefined, gridSize * gridSize * MAX_LAYERS]} 
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={palette.cell}
          roughness={0.2}
          metalness={0.8}
          transparent={opacity < 1.0}
          opacity={opacity}
        />
      </instancedMesh>
      
      {/* Helper Grid at bottom relative to stack */}
      <gridHelper args={[gridSize, gridSize, 0x444444, 0x222222]} position={[0, -(MAX_LAYERS/2) - 1, 0]} />
      <Environment preset="city" />
    </group>
  );
};

const Automata3DViewer: React.FC<Automata3DProps> = (props) => {
  const palette = PALETTES[props.theme];

  return (
    <div className="w-full h-full bg-black relative shadow-inner rounded-lg border border-slate-800 overflow-hidden">
      <Canvas
        gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}
        dpr={[1, 2]}
        shadows
        camera={{ position: [40, 40, 40], fov: 45 }}
      >
        <color attach="background" args={[palette.background]} />
        <fog attach="fog" args={[palette.background, 20, 150]} />
        
        <OrbitControls 
          autoRotate={props.isPlaying} 
          autoRotateSpeed={1.0}
          maxDistance={150}
          minDistance={10}
          makeDefault
        />

        <ambientLight intensity={0.8} />
        <pointLight position={[50, 50, 50]} intensity={2.5} castShadow />
        <pointLight position={[-50, 50, -50]} intensity={1.5} color="#ffffff" />
        <hemisphereLight intensity={0.9} groundColor={palette.background} color="#ffffff" />
        
        <Suspense fallback={null}>
          <SimulationScene {...props} />
        </Suspense>
        
      </Canvas>

      {!props.isPlaying && (
         <div className="absolute top-4 left-4 text-xs text-white/50 pointer-events-none">
           Drag to rotate • Scroll to zoom
         </div>
      )}
    </div>
  );
};

export default Automata3DViewer;