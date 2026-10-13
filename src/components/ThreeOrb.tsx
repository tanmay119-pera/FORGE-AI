import React, { useEffect, useRef, useState } from 'react';
import { VoiceState, ThemeMode } from '../types';

export type OrbModelStyle = 'crystal' | 'tesseract' | 'neural' | 'astrolabe' | 'merkaba';

interface VoiceOrbProps {
  voiceState: VoiceState;
  volume: number;
  theme: ThemeMode;
  modelStyle?: OrbModelStyle;
  onModelChange?: (model: OrbModelStyle) => void;
  showModelSelector?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const MODEL_LABELS: Array<{ id: OrbModelStyle; name: string; icon: string }> = [
  { id: 'crystal', name: 'Crystal Gem', icon: '💎' },
  { id: 'tesseract', name: '4D Tesseract', icon: '💠' },
  { id: 'neural', name: 'Neural Sphere', icon: '🌐' },
  { id: 'astrolabe', name: 'Astrolabe', icon: '⚙️' },
  { id: 'merkaba', name: 'Merkaba Star', icon: '🔯' }
];

export const ThreeOrb: React.FC<VoiceOrbProps> = ({
  voiceState,
  volume,
  theme,
  modelStyle: controlledModel,
  onModelChange,
  showModelSelector = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalModel, setInternalModel] = useState<OrbModelStyle>(() => {
    if (controlledModel) return controlledModel;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forge_orb_model') as OrbModelStyle;
      if (saved && MODEL_LABELS.some(m => m.id === saved)) return saved;
    }
    return 'crystal';
  });

  const activeModel = controlledModel || internalModel;

  const handleSelectModel = (model: OrbModelStyle) => {
    setInternalModel(model);
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_orb_model', model);
    }
    onModelChange?.(model);
  };

  const handleCycleModel = () => {
    const idx = MODEL_LABELS.findIndex(m => m.id === activeModel);
    const nextModel = MODEL_LABELS[(idx + 1) % MODEL_LABELS.length].id;
    handleSelectModel(nextModel);
  };

  const stateRef = useRef({ voiceState, volume, theme, activeModel });

  useEffect(() => {
    stateRef.current = { voiceState, volume, theme, activeModel };
  }, [voiceState, volume, theme, activeModel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 340;
    const height = 240;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const fov = 340;

    // 3D Rotation helper
    const rotate3D = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    // Project 3D point to 2D canvas
    const project = (p: Point3D): { x: number; y: number; scale: number; z: number } => {
      const scale = fov / (fov + p.z);
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        scale,
        z: p.z
      };
    };

    // ----------------------------------------------------
    // GEOMETRIES SETUP
    // ----------------------------------------------------

    // 1. Octahedron (Crystal Gem)
    const baseOctahedron: Point3D[] = [
      { x: 0, y: -42, z: 0 },
      { x: 0, y: 42, z: 0 },
      { x: 36, y: 0, z: 0 },
      { x: 0, y: 0, z: 36 },
      { x: -36, y: 0, z: 0 },
      { x: 0, y: 0, z: -36 }
    ];
    const octahedronFaces = [
      [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2],
      [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]
    ];
    const innerCrystal: Point3D[] = [
      { x: 0, y: -24, z: 0 },
      { x: 0, y: 24, z: 0 },
      { x: 20, y: 0, z: 20 },
      { x: -20, y: 0, z: 20 },
      { x: -20, y: 0, z: -20 },
      { x: 20, y: 0, z: -20 }
    ];

    // 2. 4D Tesseract (Hypercube)
    // 16 4D Vertices (outer cube w=1, inner cube w=-1)
    const baseTesseract4D: Array<{ x: number; y: number; z: number; w: number }> = [];
    [-1, 1].forEach(x => {
      [-1, 1].forEach(y => {
        [-1, 1].forEach(z => {
          [-1, 1].forEach(w => {
            baseTesseract4D.push({ x: x * 32, y: y * 32, z: z * 32, w: w * 22 });
          });
        });
      });
    });

    // 3. Icosahedron (Geodesic Neural Sphere)
    const phi = (1 + Math.sqrt(5)) / 2;
    const icoScale = 22;
    const baseIcosahedron: Point3D[] = [
      { x: -1 * icoScale, y: phi * icoScale, z: 0 },
      { x: 1 * icoScale, y: phi * icoScale, z: 0 },
      { x: -1 * icoScale, y: -phi * icoScale, z: 0 },
      { x: 1 * icoScale, y: -phi * icoScale, z: 0 },
      { x: 0, y: -1 * icoScale, z: phi * icoScale },
      { x: 0, y: 1 * icoScale, z: phi * icoScale },
      { x: 0, y: -1 * icoScale, z: -phi * icoScale },
      { x: 0, y: 1 * icoScale, z: -phi * icoScale },
      { x: phi * icoScale, y: 0, z: -1 * icoScale },
      { x: phi * icoScale, y: 0, z: 1 * icoScale },
      { x: -phi * icoScale, y: 0, z: -1 * icoScale },
      { x: -phi * icoScale, y: 0, z: 1 * icoScale }
    ];
    const icosahedronFaces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // 4. Astrolabe Core Diamond
    const astrolabeDiamond: Point3D[] = [
      { x: 0, y: -34, z: 0 },
      { x: 0, y: 34, z: 0 },
      { x: 24, y: 0, z: 0 },
      { x: 0, y: 0, z: 24 },
      { x: -24, y: 0, z: 0 },
      { x: 0, y: 0, z: -24 }
    ];

    // 5. Merkaba Star (Two Interlocking Tetrahedrons)
    const merkabaTetra1: Point3D[] = [
      { x: 0, y: -42, z: 0 },
      { x: 36 * Math.cos(0), y: 14, z: 36 * Math.sin(0) },
      { x: 36 * Math.cos((2 * Math.PI) / 3), y: 14, z: 36 * Math.sin((2 * Math.PI) / 3) },
      { x: 36 * Math.cos((4 * Math.PI) / 3), y: 14, z: 36 * Math.sin((4 * Math.PI) / 3) }
    ];
    const merkabaTetra2: Point3D[] = [
      { x: 0, y: 42, z: 0 },
      { x: 36 * Math.cos(Math.PI), y: -14, z: 36 * Math.sin(Math.PI) },
      { x: 36 * Math.cos(Math.PI + (2 * Math.PI) / 3), y: -14, z: 36 * Math.sin(Math.PI + (2 * Math.PI) / 3) },
      { x: 36 * Math.cos(Math.PI + (4 * Math.PI) / 3), y: -14, z: 36 * Math.sin(Math.PI + (4 * Math.PI) / 3) }
    ];
    const tetraFaces = [
      [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]
    ];

    // Floating Stardust Particles
    const particles = Array.from({ length: 24 }, (_, i) => {
      const theta = (i / 24) * Math.PI * 2;
      const phiAngle = (i % 3 - 1) * 0.75;
      const dist = 76 + (i % 4) * 8;
      return {
        theta,
        phi: phiAngle,
        dist,
        speed: 0.02 + (i % 5) * 0.005,
        size: 1.4 + (i % 3) * 0.8
      };
    });

    // Gyroscopic Rings
    const rings = [
      { radius: 68, tiltX: 0.85, tiltY: 0.45, tiltZ: 0.2, speed: 1.2, colorViolet: '#8b5cf6', colorCyan: '#c084fc', width: 2 },
      { radius: 84, tiltX: -0.65, tiltY: 0.95, tiltZ: -0.4, speed: -0.9, colorViolet: '#a855f7', colorCyan: '#e879f9', width: 1.6 },
      { radius: 98, tiltX: 0.35, tiltY: -0.75, tiltZ: 1.1, speed: 1.5, colorViolet: '#6366f1', colorCyan: '#818cf8', width: 1.8 }
    ];

    const lightVec: Point3D = { x: 0.577, y: -0.577, z: -0.577 };

    // ----------------------------------------------------
    // MAIN RENDER LOOP
    // ----------------------------------------------------
    const render = () => {
      const { voiceState: state, volume: vol, theme: currentTheme, activeModel: model } = stateRef.current;
      const isPureBlack = currentTheme === 'dark';

      let speedMult = 1.0;
      if (state === 'speaking') speedMult = 1.9 + vol * 1.5;
      else if (state === 'listening') speedMult = 1.5 + vol * 2.0;
      else if (state === 'thinking' || state === 'executing') speedMult = 2.4;

      time += 0.016 * speedMult;
      ctx.clearRect(0, 0, width, height);

      const pulse = state === 'speaking' || state === 'listening'
        ? 1 + vol * 0.6
        : 1 + Math.sin(time * 2.5) * 0.06;

      // 1. Soft Dynamic Ambient Backlight Glow
      const coreGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 100 * pulse);
      if (isPureBlack) {
        coreGlow.addColorStop(0, state === 'thinking' ? 'rgba(99, 102, 241, 0.45)' : 'rgba(139, 92, 246, 0.35)');
        coreGlow.addColorStop(0.6, 'rgba(124, 58, 237, 0.12)');
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        coreGlow.addColorStop(0, state === 'thinking' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(124, 58, 237, 0.22)');
        coreGlow.addColorStop(0.6, 'rgba(147, 51, 234, 0.08)');
        coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 100 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Common Rotation angles for core
      const rotX = time * 0.85;
      const rotY = time * 1.15;
      const rotZ = time * 0.45;

      // ====================================================
      // A. DRAW REVOLVING ORBITAL RINGS (BACK HALF: z > 0)
      // ====================================================
      rings.forEach((ring, rIdx) => {
        const ringTime = time * ring.speed;
        const numSegments = 24;
        const ringPoints: Point3D[] = [];

        for (let i = 0; i <= numSegments; i++) {
          const theta = (i / numSegments) * Math.PI * 2;
          const p: Point3D = {
            x: Math.cos(theta) * ring.radius * (1 + vol * 0.15),
            y: 0,
            z: Math.sin(theta) * ring.radius * (1 + vol * 0.15)
          };
          const rotated = rotate3D(p, ring.tiltX + Math.sin(ringTime * 0.4) * 0.2, ring.tiltY + ringTime, ring.tiltZ);
          ringPoints.push(rotated);
        }

        ctx.beginPath();
        for (let i = 0; i < numSegments; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          if ((p1.z + p2.z) / 2 > 0) {
            const proj1 = project(p1);
            const proj2 = project(p2);
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
          }
        }
        ctx.lineWidth = ring.width * 0.85;
        ctx.strokeStyle = isPureBlack ? 'rgba(168, 85, 247, 0.25)' : 'rgba(124, 58, 237, 0.35)';
        ctx.stroke();

        // Orbiting Photon Comet on this ring (Back half)
        const cometAngle = (ringTime * 2.2 + rIdx * 1.5) % (Math.PI * 2);
        const cometP: Point3D = {
          x: Math.cos(cometAngle) * ring.radius * (1 + vol * 0.15),
          y: 0,
          z: Math.sin(cometAngle) * ring.radius * (1 + vol * 0.15)
        };
        const cometRot = rotate3D(cometP, ring.tiltX + Math.sin(ringTime * 0.4) * 0.2, ring.tiltY + ringTime, ring.tiltZ);
        if (cometRot.z > 0) {
          const cProj = project(cometRot);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cProj.x, cProj.y, 2.5 * cProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = ring.colorCyan;
          ctx.shadowColor = ring.colorViolet;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      });

      // ====================================================
      // B. DRAW 3D MODEL CORE BASED ON ACTIVE SELECTION
      // ====================================================

      if (model === 'crystal') {
        // --- MODEL 1: CRYSTAL GEM ---
        const transformedVerts = baseOctahedron.map(v => {
          const scaled = { x: v.x * pulse, y: v.y * pulse, z: v.z * pulse };
          return rotate3D(scaled, rotX, rotY, rotZ);
        });
        const projectedVerts = transformedVerts.map(project);

        const facesWithDepth = octahedronFaces.map(faceIdxs => {
          const vA = transformedVerts[faceIdxs[0]];
          const vB = transformedVerts[faceIdxs[1]];
          const vC = transformedVerts[faceIdxs[2]];

          const edge1 = { x: vB.x - vA.x, y: vB.y - vA.y, z: vB.z - vA.z };
          const edge2 = { x: vC.x - vA.x, y: vC.y - vA.y, z: vC.z - vA.z };
          const nx = edge1.y * edge2.z - edge1.z * edge2.y;
          const ny = edge1.z * edge2.x - edge1.x * edge2.z;
          const nz = edge1.x * edge2.y - edge1.y * edge2.x;
          const len = Math.hypot(nx, ny, nz) || 1;
          const norm = { x: nx / len, y: ny / len, z: nz / len };
          const avgZ = (vA.z + vB.z + vC.z) / 3;
          const dot = Math.max(0.12, norm.x * lightVec.x + norm.y * lightVec.y + norm.z * lightVec.z);

          return { indices: faceIdxs, avgZ, dot };
        });

        facesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

        facesWithDepth.forEach(({ indices, dot }) => {
          const p0 = projectedVerts[indices[0]];
          const p1 = projectedVerts[indices[1]];
          const p2 = projectedVerts[indices[2]];

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();

          let fillStyle: string;
          if (isPureBlack) {
            const r = Math.round(110 + dot * 95);
            const g = Math.round(55 + dot * 75);
            const b = Math.round(210 + dot * 45);
            fillStyle = `rgba(${r}, ${g}, ${b}, ${0.88 + dot * 0.12})`;
          } else {
            const r = Math.round(109 - dot * 35);
            const g = Math.round(40 + dot * 50);
            const b = Math.round(217 - dot * 20);
            fillStyle = `rgba(${r}, ${g}, ${b}, 0.94)`;
          }

          ctx.fillStyle = fillStyle;
          ctx.fill();

          ctx.strokeStyle = isPureBlack
            ? `rgba(216, 180, 254, ${0.45 + dot * 0.5})`
            : `rgba(255, 255, 255, ${0.65 + dot * 0.35})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        });

        // Inner core star
        const innerTransformed = innerCrystal.map(v => rotate3D(v, -rotX * 1.2, -rotY * 1.2, rotZ));
        const innerProjected = innerTransformed.map(project);
        ctx.save();
        ctx.strokeStyle = isPureBlack ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        for (let i = 0; i < innerProjected.length; i++) {
          for (let j = i + 1; j < innerProjected.length; j++) {
            ctx.beginPath();
            ctx.moveTo(innerProjected[i].x, innerProjected[i].y);
            ctx.lineTo(innerProjected[j].x, innerProjected[j].y);
            ctx.stroke();
          }
        }
        ctx.restore();

      } else if (model === 'tesseract') {
        // --- MODEL 2: QUANTUM 4D TESSERACT HYPERCUBE ---
        const wAngle = time * 0.95;
        const cosW = Math.cos(wAngle);
        const sinW = Math.sin(wAngle);

        // 4D -> 3D projection with 4D rotation in X-W plane
        const tesseract3D: Point3D[] = baseTesseract4D.map(pt => {
          const x4 = pt.x * cosW - pt.w * sinW;
          const w4 = pt.x * sinW + pt.w * cosW;
          const k = 100 / (100 + w4 * 0.4);
          const p3: Point3D = {
            x: x4 * k * pulse,
            y: pt.y * k * pulse,
            z: pt.z * k * pulse
          };
          return rotate3D(p3, rotX * 0.8, rotY * 0.9, rotZ * 0.5);
        });

        const projTess = tesseract3D.map(project);

        // Central Singularity Core
        ctx.save();
        const centerGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18 * pulse);
        centerGrad.addColorStop(0, '#ffffff');
        centerGrad.addColorStop(0.3, isPureBlack ? '#c084fc' : '#a855f7');
        centerGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw 32 Hypercube edges
        ctx.save();
        ctx.lineWidth = 1.35;
        for (let i = 0; i < 16; i++) {
          for (let j = i + 1; j < 16; j++) {
            // Edges exist between vertices differing in exactly one coordinate bit
            const diff = (i ^ j);
            if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
              const pA = projTess[i];
              const pB = projTess[j];
              const avgDepth = (tesseract3D[i].z + tesseract3D[j].z) / 2;
              const alpha = Math.max(0.2, Math.min(0.9, 0.55 - avgDepth * 0.008));

              ctx.beginPath();
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(pB.x, pB.y);
              ctx.strokeStyle = isPureBlack
                ? `rgba(216, 180, 254, ${alpha})`
                : `rgba(124, 58, 237, ${alpha})`;
              ctx.stroke();
            }
          }
        }

        // Hypercube Corner Beacons
        projTess.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1.2, 2.2 * pt.scale), 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? '#e9d5ff' : '#7c3aed';
          ctx.fill();
        });
        ctx.restore();

      } else if (model === 'neural') {
        // --- MODEL 3: NEURAL GEODESIC SPHERE ---
        const transformedIco = baseIcosahedron.map(v => {
          const scaled = { x: v.x * pulse, y: v.y * pulse, z: v.z * pulse };
          return rotate3D(scaled, rotX * 0.7, rotY * 0.85, rotZ * 0.6);
        });
        const projIco = transformedIco.map(project);

        // Sort 20 faces by depth
        const icoFacesDepth = icosahedronFaces.map(f => {
          const avgZ = (transformedIco[f[0]].z + transformedIco[f[1]].z + transformedIco[f[2]].z) / 3;
          return { indices: f, avgZ };
        }).sort((a, b) => b.avgZ - a.avgZ);

        // Draw translucent geodesic lattice facets
        ctx.save();
        icoFacesDepth.forEach(({ indices, avgZ }) => {
          const p0 = projIco[indices[0]];
          const p1 = projIco[indices[1]];
          const p2 = projIco[indices[2]];

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();

          const alpha = Math.max(0.12, Math.min(0.65, 0.38 - avgZ * 0.008));
          ctx.fillStyle = isPureBlack
            ? `rgba(147, 51, 234, ${alpha})`
            : `rgba(124, 58, 237, ${alpha * 0.75})`;
          ctx.fill();

          ctx.strokeStyle = isPureBlack
            ? 'rgba(216, 180, 254, 0.45)'
            : 'rgba(109, 40, 217, 0.55)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Synaptic Nodes at vertices
        projIco.forEach((pt, idx) => {
          const nodePulse = Math.sin(time * 3 + idx * 0.8) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (2.4 + nodePulse * 1.6) * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? '#ffffff' : '#6d28d9';
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 8;
          ctx.fill();
        });

        // Pulsing synaptic action potentials along edges
        for (let i = 0; i < 3; i++) {
          const edgeIdx = Math.floor((time * 2 + i * 4) % icosahedronFaces.length);
          const f = icosahedronFaces[edgeIdx];
          const pA = projIco[f[0]];
          const pB = projIco[f[1]];
          const tProgress = (time * 1.8 + i * 0.33) % 1;
          const pulseX = pA.x + (pB.x - pA.x) * tProgress;
          const pulseY = pA.y + (pB.y - pA.y) * tProgress;

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
        ctx.restore();

      } else if (model === 'astrolabe') {
        // --- MODEL 4: CELESTIAL ASTROLABE GYROSCOPE ---
        ctx.save();

        // Radiating Laser Beams along principal axes
        const laserLen = 135 * pulse;
        const beamAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
        beamAngles.forEach(ang => {
          const beamDir: Point3D = {
            x: Math.cos(ang + time * 0.3) * laserLen,
            y: Math.sin(ang + time * 0.3) * laserLen * 0.3,
            z: Math.sin(ang + time * 0.3) * laserLen
          };
          const bProj = project(beamDir);

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(bProj.x, bProj.y);
          ctx.strokeStyle = isPureBlack
            ? 'rgba(216, 180, 254, 0.7)'
            : 'rgba(124, 58, 237, 0.8)';
          ctx.lineWidth = 1.6;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 12;
          ctx.stroke();
        });

        // Central Octahedral Diamond
        const astrolabeVerts = astrolabeDiamond.map(v => {
          return rotate3D({ x: v.x * pulse, y: v.y * pulse, z: v.z * pulse }, rotX * 1.2, rotY * 1.4, 0);
        });
        const projAstro = astrolabeVerts.map(project);

        octahedronFaces.forEach(f => {
          const p0 = projAstro[f[0]];
          const p1 = projAstro[f[1]];
          const p2 = projAstro[f[2]];
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = isPureBlack ? 'rgba(168, 85, 247, 0.75)' : 'rgba(124, 58, 237, 0.85)';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // 4 Precision Concentric Gimbal Rings with tick marks
        const astrolabeRings = [
          { r: 48, tiltX: 0.9, tiltY: time * 0.8, tiltZ: 0 },
          { r: 66, tiltX: -0.7, tiltY: -time * 0.9, tiltZ: 0.3 },
          { r: 85, tiltX: 0.4, tiltY: time * 1.1, tiltZ: -0.5 },
          { r: 102, tiltX: 0, tiltY: 0, tiltZ: time * 0.6 }
        ];

        astrolabeRings.forEach((ar, ringIdx) => {
          const segments = 32;
          const pts: Point3D[] = [];
          for (let s = 0; s <= segments; s++) {
            const th = (s / segments) * Math.PI * 2;
            const p: Point3D = {
              x: Math.cos(th) * ar.r * pulse,
              y: 0,
              z: Math.sin(th) * ar.r * pulse
            };
            pts.push(rotate3D(p, ar.tiltX, ar.tiltY, ar.tiltZ));
          }

          ctx.beginPath();
          for (let s = 0; s < segments; s++) {
            const pA = project(pts[s]);
            const pB = project(pts[s + 1]);
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
          }
          ctx.strokeStyle = isPureBlack
            ? `rgba(192, 132, 252, ${0.5 + ringIdx * 0.12})`
            : `rgba(124, 58, 237, ${0.6 + ringIdx * 0.1})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Laser tick marks
          for (let s = 0; s < segments; s += 4) {
            const pNode = project(pts[s]);
            ctx.beginPath();
            ctx.arc(pNode.x, pNode.y, 2 * pNode.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        });
        ctx.restore();

      } else if (model === 'merkaba') {
        // --- MODEL 5: PRISMATIC MERKABA STAR (STELLATED OCTAHEDRON) ---
        // Tetrahedron 1 (Pointing Up, clockwise)
        const rotTetra1 = merkabaTetra1.map(v => {
          const scaled = { x: v.x * pulse, y: v.y * pulse, z: v.z * pulse };
          return rotate3D(scaled, rotX * 0.7, rotY * 1.1, 0);
        });
        const projTetra1 = rotTetra1.map(project);

        // Tetrahedron 2 (Pointing Down, counter-clockwise)
        const rotTetra2 = merkabaTetra2.map(v => {
          const scaled = { x: v.x * pulse, y: v.y * pulse, z: v.z * pulse };
          return rotate3D(scaled, rotX * 0.7, -rotY * 1.1, 0);
        });
        const projTetra2 = rotTetra2.map(project);

        ctx.save();
        // Draw Tetrahedron 1 faces
        tetraFaces.forEach(f => {
          const p0 = projTetra1[f[0]];
          const p1 = projTetra1[f[1]];
          const p2 = projTetra1[f[2]];
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = isPureBlack ? 'rgba(168, 85, 247, 0.45)' : 'rgba(124, 58, 237, 0.55)';
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });

        // Draw Tetrahedron 2 faces
        tetraFaces.forEach(f => {
          const p0 = projTetra2[f[0]];
          const p1 = projTetra2[f[1]];
          const p2 = projTetra2[f[2]];
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = isPureBlack ? 'rgba(236, 72, 153, 0.45)' : 'rgba(219, 39, 119, 0.55)';
          ctx.fill();
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });

        // Central Star Core Flare
        ctx.beginPath();
        ctx.arc(cx, cy, 14 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 16;
        ctx.fill();

        // Apex Star Beacons
        [projTetra1[0], projTetra2[0]].forEach(apex => {
          ctx.beginPath();
          ctx.arc(apex.x, apex.y, 3 * apex.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.fill();
        });
        ctx.restore();
      }

      // ====================================================
      // C. DRAW REVOLVING ORBITAL RINGS (FRONT HALF: z <= 0)
      // ====================================================
      rings.forEach((ring, rIdx) => {
        const ringTime = time * ring.speed;
        const numSegments = 24;
        const ringPoints: Point3D[] = [];

        for (let i = 0; i <= numSegments; i++) {
          const theta = (i / numSegments) * Math.PI * 2;
          const p: Point3D = {
            x: Math.cos(theta) * ring.radius * (1 + vol * 0.15),
            y: 0,
            z: Math.sin(theta) * ring.radius * (1 + vol * 0.15)
          };
          const rotated = rotate3D(p, ring.tiltX + Math.sin(ringTime * 0.4) * 0.2, ring.tiltY + ringTime, ring.tiltZ);
          ringPoints.push(rotated);
        }

        ctx.beginPath();
        for (let i = 0; i < numSegments; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          if ((p1.z + p2.z) / 2 <= 0) {
            const proj1 = project(p1);
            const proj2 = project(p2);
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
          }
        }
        ctx.lineWidth = ring.width * 1.25;
        ctx.strokeStyle = isPureBlack ? 'rgba(192, 132, 252, 0.85)' : 'rgba(124, 58, 237, 0.9)';
        ctx.stroke();

        // Orbiting Photon Comet on this ring (Front half)
        const cometAngle = (ringTime * 2.2 + rIdx * 1.5) % (Math.PI * 2);
        const cometP: Point3D = {
          x: Math.cos(cometAngle) * ring.radius * (1 + vol * 0.15),
          y: 0,
          z: Math.sin(cometAngle) * ring.radius * (1 + vol * 0.15)
        };
        const cometRot = rotate3D(cometP, ring.tiltX + Math.sin(ringTime * 0.4) * 0.2, ring.tiltY + ringTime, ring.tiltZ);

        if (cometRot.z <= 0) {
          const cProj = project(cometRot);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cProj.x, cProj.y, 3.8 * cProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? '#ffffff' : '#7c3aed';
          ctx.shadowColor = ring.colorViolet;
          ctx.shadowBlur = 14;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cProj.x, cProj.y, 6.5 * cProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? 'rgba(216, 180, 254, 0.4)' : 'rgba(168, 85, 247, 0.3)';
          ctx.fill();
          ctx.restore();
        }
      });

      // ====================================================
      // D. FLOATING 3D QUANTUM STARDUST PARTICLES
      // ====================================================
      particles.forEach((pt) => {
        const curTheta = pt.theta + time * pt.speed;
        const p: Point3D = {
          x: Math.cos(curTheta) * Math.cos(pt.phi) * pt.dist * pulse,
          y: Math.sin(pt.phi) * pt.dist * pulse,
          z: Math.sin(curTheta) * Math.cos(pt.phi) * pt.dist * pulse
        };

        const rot = rotate3D(p, time * 0.3, time * 0.4, 0);
        const proj = project(rot);

        ctx.save();
        ctx.beginPath();
        const pRadius = pt.size * proj.scale;
        ctx.arc(proj.x, proj.y, Math.max(0.8, pRadius), 0, Math.PI * 2);
        const alpha = Math.max(0.15, Math.min(0.85, (proj.scale - 0.7) * 2));
        ctx.fillStyle = isPureBlack
          ? `rgba(216, 180, 254, ${alpha})`
          : `rgba(109, 40, 217, ${alpha})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isPureBlack = theme === 'dark';

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-visible">
      {/* 3D Canvas Visualizer (Click anywhere to cycle models) */}
      <div
        onClick={handleCycleModel}
        className="cursor-pointer group relative flex items-center justify-center"
        title="Click to cycle 3D AI Visualizer Core"
      >
        <canvas
          ref={canvasRef}
          style={{ width: '340px', height: '240px' }}
          className="transition-transform group-hover:scale-[1.02] duration-200"
        />
        <div className={`absolute bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
          isPureBlack ? 'bg-neutral-900/90 text-violet-300 border border-neutral-800' : 'bg-white/90 text-violet-700 border border-neutral-200 shadow-sm'
        }`}>
          Click to cycle model
        </div>
      </div>

      {/* Interactive 3D Model Selector Pills */}
      {showModelSelector && (
        <div className={`mt-2 flex items-center gap-1 p-1 rounded-full border transition-all ${
          isPureBlack
            ? 'bg-[#121212]/90 border-neutral-800/90 text-neutral-400'
            : 'bg-neutral-100/90 border-neutral-200/90 text-neutral-600 shadow-sm'
        }`}>
          {MODEL_LABELS.map(m => {
            const isSelected = activeModel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectModel(m.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  isSelected
                    ? isPureBlack
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-white text-violet-700 shadow-sm font-extrabold'
                    : isPureBlack
                    ? 'hover:text-white hover:bg-neutral-800/60'
                    : 'hover:text-black hover:bg-neutral-200/60'
                }`}
                title={`Switch to ${m.name}`}
              >
                <span>{m.icon}</span>
                <span className="hidden sm:inline">{m.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
