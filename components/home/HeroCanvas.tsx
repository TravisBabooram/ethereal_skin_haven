"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  opacityTarget: number;
  phase: number;       // horizontal oscillation phase
  hue: number;         // 0 = gold, 1 = pink/rose
}

function createParticle(canvasW: number, canvasH: number): Particle {
  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.18 + Math.random() * 0.32),
    size: 1 + Math.random() * 3.5,
    opacity: 0,
    opacityTarget: 0.15 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.72 ? 0 : 1, // 72% gold, 28% rose
  };
}

export default function HeroCanvas({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 28 : 72;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      // Reinit particles on resize
      particlesRef.current = Array.from({ length: COUNT }, () =>
        createParticle(canvas.offsetWidth, canvas.offsetHeight)
      );
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let last = performance.now();

    const draw = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      timeRef.current += delta;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      for (const p of particlesRef.current) {
        // Fade in
        if (p.opacity < p.opacityTarget) p.opacity = Math.min(p.opacity + delta * 0.4, p.opacityTarget);

        // Move
        p.x += p.vx + Math.sin(timeRef.current * 0.4 + p.phase) * 0.12;
        p.y += p.vy;

        // Reset when off top
        if (p.y < -p.size * 2) {
          p.x = Math.random() * W;
          p.y = H + p.size;
          p.opacity = 0;
          p.opacityTarget = 0.15 + Math.random() * 0.55;
        }
        if (p.x < -p.size) p.x = W + p.size;
        if (p.x > W + p.size) p.x = -p.size;

        // Draw: radial glow
        const r = p.size * 3.5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);

        let cInner: string;
        let cOuter: string;
        if (isDark) {
          cInner = p.hue === 0
            ? `rgba(212, 168, 44, ${p.opacity})`
            : `rgba(244, 40, 112, ${p.opacity * 0.7})`;
          cOuter = p.hue === 0
            ? `rgba(168, 126, 24, 0)`
            : `rgba(200, 0, 80, 0)`;
        } else {
          cInner = p.hue === 0
            ? `rgba(192, 144, 32, ${p.opacity * 0.9})`
            : `rgba(232, 0, 96, ${p.opacity * 0.6})`;
          cOuter = p.hue === 0
            ? `rgba(144, 104, 8, 0)`
            : `rgba(168, 0, 72, 0)`;
        }

        grad.addColorStop(0, cInner);
        grad.addColorStop(0.5, p.hue === 0
          ? (isDark ? `rgba(212, 168, 44, ${p.opacity * 0.3})` : `rgba(192, 144, 32, ${p.opacity * 0.3})`)
          : (isDark ? `rgba(244, 40, 112, ${p.opacity * 0.2})` : `rgba(232, 0, 96, ${p.opacity * 0.2})`));
        grad.addColorStop(1, cOuter);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? (p.hue === 0 ? `rgba(240, 200, 100, ${p.opacity})` : `rgba(255, 100, 160, ${p.opacity})`)
          : (p.hue === 0 ? `rgba(200, 160, 40, ${p.opacity})` : `rgba(240, 40, 100, ${p.opacity})`);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}
