"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Envelope3DProps {
  recipientName: string;
  designation?: string;
  sender?: string;
  isVip?: boolean;
  stage: "closed" | "opening" | "emerging" | "settled" | "message";
  onOpen: () => void;
}

export default function Envelope3D({
  recipientName,
  designation,
  sender,
  isVip = false,
  stage,
  onOpen,
}: Envelope3DProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== "closed") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isClosed = stage === "closed";
  const isOpeningOrLater = stage !== "closed";

  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[420px] mx-auto py-10 perspective-container cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isClosed ? onOpen : undefined}
      onKeyDown={(e) => {
        if (isClosed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={isClosed ? 0 : -1}
      aria-label={`Open Teacher's Day invitation for ${recipientName}`}
    >
      <motion.div
        className="relative w-[320px] sm:w-[360px] h-[220px] sm:h-[240px] preserve-3d"
        animate={{
          rotateX: isClosed ? tilt.y : 0,
          rotateY: isClosed ? tilt.x : 0,
          y: isClosed ? [0, -8, 0] : 0,
          scale: stage === "closed" ? 1 : stage === "opening" ? 1.04 : 0.9,
          opacity: stage === "emerging" || stage === "settled" || stage === "message" ? 0 : 1,
        }}
        transition={{
          y: {
            repeat: isClosed ? Infinity : 0,
            duration: 3.2,
            ease: "easeInOut",
          },
          scale: { duration: 0.6, ease: "easeOut" },
          opacity: { duration: 0.6, delay: stage === "emerging" ? 0.3 : 0 },
        }}
      >
        {/* Envelope Base Shadow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-maroon/20 rounded-full blur-xl transform scale-y-50" />

        {/* Envelope Back Plate */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E2CAA0] to-[#C9A66B] rounded-xl border border-gold/60 shadow-envelope-warm overflow-hidden preserve-3d">
          {/* Inner Lining Pattern */}
          <div 
            className="absolute inset-0 opacity-15 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%237A2A2E' fill-opacity='0.6'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%237A2A2E' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Light Burst from Inside when opening */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,235,170,0.95)_0%,rgba(255,145,66,0.5)_50%,transparent_80%)] blur-md pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: stage === "opening" ? [0, 1, 0.8] : 0,
              scale: stage === "opening" ? [0.5, 1.4, 1.2] : 0.5,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>

        {/* Envelope Front Pocket (Lower & Side flaps) */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none preserve-3d z-10">
          {/* Bottom Flap with Address Stamp */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t from-[#F8EDD7] via-[#FBF3E4] to-[#F3E1BE] border-t border-gold/40 shadow-sm flex flex-col items-center justify-center p-4 text-center"
            style={{
              clipPath: "polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0 100%)",
            }}
          >
            <div className="mt-8 space-y-1.5">
              {isVip && (
                <span className="inline-block text-[9px] uppercase tracking-[0.2em] font-bold text-gold-deep bg-sand/80 px-2.5 py-0.5 rounded-full border border-gold/40 mb-1">
                  VIP Dignitary Invitation
                </span>
              )}
              <span className="font-serif italic text-ink-soft text-base sm:text-lg block tracking-wide">
                To,
              </span>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon tracking-normal drop-shadow-sm px-2">
                {recipientName}
              </h2>
              <span className="inline-block text-[10.5px] uppercase tracking-widest text-gold-deep font-semibold bg-gold-light/25 px-3 py-0.5 rounded-full border border-gold/30">
                {designation || "Department of Computer Engineering"}
              </span>
              {sender && (
                <div className="text-[9.5px] text-ink-soft/80 italic pt-0.5 font-medium">
                  From: {sender.split(",")[0]}
                </div>
              )}
            </div>

            {/* Click to open badge / hint */}
            {isClosed && (
              <motion.div
                className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] tracking-wider font-semibold text-maroon bg-paper/90 px-3.5 py-1 rounded-full shadow-sm border border-gold/40"
                animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span>Tap to Open</span>
                <span className="text-flame">✨</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* 3D Top Flap with Wax Seal */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[62%] preserve-3d z-20 origin-top"
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: isOpeningOrLater ? -175 : 0,
          }}
          transition={{
            duration: 0.85,
            ease: [0.65, 0.05, 0.36, 1],
          }}
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(175deg, #E8C77E 0%, #D4A750 60%, #B27F2E 100%)",
            boxShadow: "0 10px 20px -8px rgba(122,42,46,0.4)",
          }}
        >
          {/* Wax Seal / Diya Motif */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#9E3C41] via-[#7A2A2E] to-[#5C1D21] border-2 border-gold-light shadow-lg flex items-center justify-center"
            animate={{
              scale: isOpeningOrLater ? 0.3 : 1,
              opacity: isOpeningOrLater ? 0 : 1,
            }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-xl select-none filter drop-shadow">🪔</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
