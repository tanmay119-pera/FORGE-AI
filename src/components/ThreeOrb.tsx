import React, { useEffect, useRef } from 'react';
import { VoiceState, ThemeMode } from '../types';

interface VoiceOrbProps {
  voiceState: VoiceState;
  volume: number;
  theme: ThemeMode;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const ThreeOrb: React.FC<VoiceOrbProps> = ({ voiceState, volume, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ voiceState, volume, theme });

  useEffect(() => {
    stateRef.current = { voiceState, volume, theme };
  }, [voiceState, volume, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 320;
    const height = 240;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const fov = 340; // 3D Camera distance for smooth perspective

    // 3D Rotation helper
    const rotate3D = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      // Rotate around X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      // Rotate around Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      // Rotate around Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    // Project 3D to 2D
    const project = (p: Point3D): { x: number; y: number; scale: number; z: number } => {
      const scale = fov / (fov + p.z);
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        scale,
        z: p.z
      };
    };

    // Octahedral Polyhedron vertices (3D Crystal Gem)
    const baseOctahedron: Point3D[] = [
      { x: 0, y: -42, z: 0 },  // Top apex
      { x: 0, y: 42, z: 0 },   // Bottom apex
      { x: 36, y: 0, z: 0 },   // Right
      { x: 0, y: 0, z: 36 },   // Front
      { x: -36, y: 0, z: 0 },  // Left
      { x: 0, y: 0, z: -36 }   // Back
    ];

    // 8 Triangular faces of Octahedron
    const octahedronFaces = [
      [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2], // Top 4 faces
      [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]  // Bottom 4 faces
    ];

    // Secondary inner crystal vertices (nested star facet)
    const innerCrystal: Point3D[] = [
      { x: 0, y: -24, z: 0 },
      { x: 0, y: 24, z: 0 },
      { x: 20, y: 0, z: 20 },
      { x: -20, y: 0, z: 20 },
      { x: -20, y: 0, z: -20 },
      { x: 20, y: 0, z: -20 }
    ];

    // Orbiting particle dust (20 floating 3D nodes)
    const particles = Array.from({ length: 22 }, (_, i) => {
      const theta = (i / 22) * Math.PI * 2;
      const phi = (i % 3 - 1) * 0.7;
      const dist = 75 + (i % 4) * 8;
      return {
        theta,
        phi,
        dist,
        speed: 0.02 + (i % 5) * 0.005,
        size: 1.5 + (i % 3) * 0.8
      };
    });

    // 3 Distinct Revolving Orbital Gimbal Rings configuration
    const rings = [
      { radius: 68, tiltX: 0.85, tiltY: 0.45, tiltZ: 0.2, speed: 1.2, colorViolet: '#8b5cf6', colorCyan: '#c084fc', width: 2 },
      { radius: 84, tiltX: -0.65, tiltY: 0.95, tiltZ: -0.4, speed: -0.9, colorViolet: '#a855f7', colorCyan: '#e879f9', width: 1.6 },
      { radius: 98, tiltX: 0.35, tiltY: -0.75, tiltZ: 1.1, speed: 1.5, colorViolet: '#6366f1', colorCyan: '#818cf8', width: 1.8 }
    ];

    const render = () => {
      const { voiceState: state, volume: vol, theme: currentTheme } = stateRef.current;
      const isPureBlack = currentTheme === 'dark';

      // Speed adjusts smoothly based on AI state
      let speedMult = 1.0;
      if (state === 'speaking') speedMult = 1.9 + vol * 1.5;
      else if (state === 'listening') speedMult = 1.5 + vol * 2.0;
      else if (state === 'thinking' || state === 'executing') speedMult = 2.4;

      time += 0.016 * speedMult;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Dynamic Ambient Backlight Glow
      const pulse = state === 'speaking' || state === 'listening'
        ? 1 + vol * 0.6
        : 1 + Math.sin(time * 2.5) * 0.06;

      const coreGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 95 * pulse);
      if (isPureBlack) {
        coreGlow.addColorStop(0, state === 'thinking' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(139, 92, 246, 0.35)');
        coreGlow.addColorStop(0.6, 'rgba(124, 58, 237, 0.12)');
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        coreGlow.addColorStop(0, state === 'thinking' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(124, 58, 237, 0.22)');
        coreGlow.addColorStop(0.6, 'rgba(147, 51, 234, 0.08)');
        coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 95 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Rotation angles for 3D crystal core
      const coreRotX = time * 0.85;
      const coreRotY = time * 1.15;
      const coreRotZ = time * 0.45;

      // Transform and project crystal vertices
      const transformedVerts = baseOctahedron.map(v => {
        const scaled = {
          x: v.x * pulse,
          y: v.y * pulse,
          z: v.z * pulse
        };
        return rotate3D(scaled, coreRotX, coreRotY, coreRotZ);
      });

      const projectedVerts = transformedVerts.map(project);

      // Light vector for 3D Phong facet shading
      const lightVec: Point3D = { x: 0.577, y: -0.577, z: -0.577 };

      // Calculate depth and normals for all 8 faces
      const facesWithDepth = octahedronFaces.map((faceIdxs) => {
        const vA = transformedVerts[faceIdxs[0]];
        const vB = transformedVerts[faceIdxs[1]];
        const vC = transformedVerts[faceIdxs[2]];

        // Normal = (B - A) x (C - A)
        const edge1 = { x: vB.x - vA.x, y: vB.y - vA.y, z: vB.z - vA.z };
        const edge2 = { x: vC.x - vA.x, y: vC.y - vA.y, z: vC.z - vA.z };
        const nx = edge1.y * edge2.z - edge1.z * edge2.y;
        const ny = edge1.z * edge2.x - edge1.x * edge2.z;
        const nz = edge1.x * edge2.y - edge1.y * edge2.x;
        const len = Math.hypot(nx, ny, nz) || 1;
        const norm = { x: nx / len, y: ny / len, z: nz / len };

        // Average Z for depth sorting
        const avgZ = (vA.z + vB.z + vC.z) / 3;

        // Diffuse light intensity: dot(norm, light)
        const dot = Math.max(0.12, norm.x * lightVec.x + norm.y * lightVec.y + norm.z * lightVec.z);

        return {
          indices: faceIdxs,
          avgZ,
          normal: norm,
          dot
        };
      });

      // Z-Sort: draw back elements first, then front elements for true 3D
      facesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

      // ==========================================
      // A. DRAW REVOLVING ORBITAL RINGS (BACK HALF: z > 0)
      // ==========================================
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

        // Draw ring segments located behind the crystal
        ctx.beginPath();
        for (let i = 0; i < numSegments; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          if ((p1.z + p2.z) / 2 > 0) { // Back half
            const proj1 = project(p1);
            const proj2 = project(p2);
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
          }
        }
        ctx.lineWidth = ring.width * 0.85;
        ctx.strokeStyle = isPureBlack
          ? 'rgba(168, 85, 247, 0.25)'
          : 'rgba(124, 58, 237, 0.35)';
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

      // ==========================================
      // B. DRAW 3D FACETED CRYSTAL CORE (Not a flat circle!)
      // ==========================================
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

        // Shaded color gradient for each 3D crystal face
        let fillStyle: string;
        if (isPureBlack) {
          const r = Math.round(110 + dot * 95);
          const g = Math.round(55 + dot * 75);
          const b = Math.round(210 + dot * 45);
          const a = 0.88 + dot * 0.12;
          fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
          // Vibrant high-contrast purple/violet in light mode
          const r = Math.round(109 - dot * 35);
          const g = Math.round(40 + dot * 50);
          const b = Math.round(217 - dot * 20);
          fillStyle = `rgba(${r}, ${g}, ${b}, 0.94)`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Glowing 3D Crystal Edges
        ctx.strokeStyle = isPureBlack
          ? `rgba(216, 180, 254, ${0.45 + dot * 0.5})`
          : `rgba(255, 255, 255, ${0.65 + dot * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });

      // Inner counter-rotating core star for holographic depth
      const innerTransformed = innerCrystal.map(v => {
        return rotate3D(v, -coreRotX * 1.2, -coreRotY * 1.2, coreRotZ);
      });
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

      // ==========================================
      // C. DRAW REVOLVING ORBITAL RINGS (FRONT HALF: z <= 0)
      // Passes smoothly in FRONT of the crystal!
      // ==========================================
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

        // Draw ring segments in FRONT of crystal
        ctx.beginPath();
        for (let i = 0; i < numSegments; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          if ((p1.z + p2.z) / 2 <= 0) { // Front half
            const proj1 = project(p1);
            const proj2 = project(p2);
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
          }
        }
        ctx.lineWidth = ring.width * 1.25;
        ctx.strokeStyle = isPureBlack
          ? 'rgba(192, 132, 252, 0.85)'
          : 'rgba(124, 58, 237, 0.9)';
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
          // Glowing head
          ctx.beginPath();
          ctx.arc(cProj.x, cProj.y, 3.8 * cProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? '#ffffff' : '#7c3aed';
          ctx.shadowColor = ring.colorViolet;
          ctx.shadowBlur = 14;
          ctx.fill();

          // Outer halo
          ctx.beginPath();
          ctx.arc(cProj.x, cProj.y, 6.5 * cProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isPureBlack ? 'rgba(216, 180, 254, 0.4)' : 'rgba(168, 85, 247, 0.3)';
          ctx.fill();
          ctx.restore();
        }
      });

      // ==========================================
      // D. FLOATING 3D QUANTUM STARDUST PARTICLES
      // ==========================================
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

  return (
    <div className="relative w-full h-[220px] flex items-center justify-center select-none overflow-visible">
      <canvas
        ref={canvasRef}
        style={{ width: '320px', height: '240px' }}
        className="pointer-events-none"
      />
    </div>
  );
};
