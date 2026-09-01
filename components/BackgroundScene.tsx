"use client";

import React, { useMemo } from "react";

interface Particle {
  id: number;
  left: string;
  topStart: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  type: "marigold" | "gold" | "bokeh";
  opacity: number;
}

export default function BackgroundScene() {
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    // Petals & Gold sparkles
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        topStart: `${-10 - (i % 5) * 5}%`,
        size: 7 + (i % 4) * 3,
        duration: 9 + (i % 5) * 2.5,
        delay: (i * 0.7) % 9,
        driftX: (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 14),
        type: i % 3 === 0 ? "gold" : "marigold",
        opacity: 0.35 + (i % 5) * 0.12,
      });
    }
    // Ambient Bokeh Orbs
    for (let j = 0; j < 8; j++) {
      list.push({
        id: 100 + j,
        left: `${(j * 23 + 12) % 92}%`,
        topStart: `${(j * 19 + 8) % 85}%`,
        size: 80 + (j % 4) * 50,
        duration: 12 + (j % 3) * 4,
        delay: j * 1.2,
        driftX: (j % 2 === 0 ? 1 : -1) * 30,
        type: "bokeh",
        opacity: 0.18 + (j % 3) * 0.08,
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#FBF3E4] via-[#F6E7CA] to-[#EDD7B0]">
      {/* Central Warm Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-50 bg-[radial-gradient(circle,rgba(255,217,138,0.7)_0%,rgba(232,199,126,0.3)_40%,transparent_70%)]" 
      />

      {/* Decorative Floral Watermark Motifs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 opacity-[0.06] text-gold-deep rotate-12">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,0 C120,40 160,40 200,100 C160,160 120,160 100,200 C80,160 40,160 0,100 C40,40 80,40 100,0 Z" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6,6" />
        </svg>
      </div>
      <div className="absolute -bottom-28 -right-28 w-[450px] h-[450px] opacity-[0.05] text-gold-deep -rotate-12">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,0 C120,40 160,40 200,100 C160,160 120,160 100,200 C80,160 40,160 0,100 C40,40 80,40 100,0 Z" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="5" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8,8" />
        </svg>
      </div>

      {/* Floating Particles & Bokeh */}
      {particles.map((p) => {
        if (p.type === "bokeh") {
          return (
            <div
              key={p.id}
              className="absolute rounded-full blur-2xl animate-pulse"
              style={{
                left: p.left,
                top: p.topStart,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: "radial-gradient(circle, rgba(255,217,138,0.7) 0%, rgba(232,114,46,0.2) 60%, transparent 80%)",
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        }

        const isGold = p.type === "gold";

        return (
          <div
            key={p.id}
            className="absolute animate-drift"
            style={{
              left: p.left,
              top: p.topStart,
              width: `${p.size}px`,
              height: isGold ? `${p.size}px` : `${p.size * 1.3}px`,
              borderRadius: isGold ? "50%" : "70% 0 70% 0",
              background: isGold
                ? "radial-gradient(circle at 35% 35%, #FFF8E7, #E8C77E 40%, #B27F2E 100%)"
                : "radial-gradient(circle at 30% 30%, #FFD98A, #FF9142 60%, #E8722E 100%)",
              boxShadow: isGold
                ? "0 0 6px rgba(232,199,126,0.8)"
                : "0 1px 3px rgba(122,42,46,0.3)",
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              // @ts-expect-error custom css variable
              "--dx": `${p.driftX}px`,
            }}
          />
        );
      })}
    </div>
  );
}
