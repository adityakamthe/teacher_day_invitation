"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, ArrowUpCircle } from "lucide-react";

interface FacultyMember {
  id?: number;
  slug: string;
  name: string;
  designation: string;
}

interface CustomMessageData {
  salutation?: string;
  lead?: string;
  paragraphs?: string[];
  closing?: string;
  signature?: string;
}

interface EventData {
  hostedBy: string;
  message: {
    salutation: string;
    lead: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
}

interface TeamMessageProps {
  faculty: FacultyMember;
  event: EventData;
  customMessage?: CustomMessageData;
  sender?: string;
  isVip?: boolean;
  onBackToCard: () => void;
}

export default function TeamMessage({
  faculty,
  event,
  customMessage,
  sender,
  isVip = false,
  onBackToCard,
}: TeamMessageProps) {
  const [rsvped, setRsvped] = useState(false);

  const activeMessage = {
    salutation: customMessage?.salutation || event.message.salutation,
    lead: customMessage?.lead || event.message.lead,
    paragraphs: customMessage?.paragraphs || event.message.paragraphs,
    closing: customMessage?.closing || event.message.closing,
    signature: customMessage?.signature || event.message.signature,
  };

  const handleCelebrate = () => {
    setRsvped(true);
    // Trigger festive gold and marigold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#B27F2E", "#E8C77E", "#7A2A2E", "#FF9142", "#FFD98A"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[460px] mx-auto my-6"
    >
      <div className="relative w-full bg-gradient-to-b from-[#FFFDF8] via-[#FBF3E4] to-[#F5E6CC] rounded-2xl p-7 sm:p-9 border border-gold/50 shadow-card-warm overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold-deep via-gold-light to-maroon" />

        {/* Paper Texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M0 40 Q40 0 80 40 Q40 80 0 40 Z' fill='none' stroke='%238C6222' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col space-y-4 text-ink">
          {/* Header */}
          <div className="text-center space-y-2 pb-2 border-b border-gold/30">
            {/* Logos Bar */}
            <div className="flex items-center justify-center gap-4 pb-1">
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-xs flex items-center justify-center">
                <Image
                  src="/logos/tssm-logo-clean.png"
                  alt="TSSM BSCOER Logo"
                  width={36}
                  height={36}
                  className="object-contain max-h-[30px] w-auto drop-shadow-xs"
                />
              </div>
              <span className="text-gold/50 text-xs">&bull;</span>
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-xs flex items-center justify-center">
                <Image
                  src="/logos/aces-logo-clean.png"
                  alt="ACES Logo"
                  width={36}
                  height={36}
                  className="object-contain max-h-[30px] w-auto drop-shadow-xs"
                />
              </div>
            </div>

            <span className="text-[11px] uppercase tracking-widest font-semibold text-gold-deep block">
              {isVip ? "A Personal Note from the HOD" : "A Message of Gratitude"}
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-maroon">
              {activeMessage.salutation} {faculty.name},
            </h2>
          </div>

          {/* Lead Paragraph */}
          <p className="text-sm font-medium text-ink leading-relaxed italic text-center text-maroon/90 bg-gold-light/20 p-3 rounded-xl border border-gold/30">
            &ldquo;{activeMessage.lead}&rdquo;
          </p>

          {/* Body Paragraphs */}
          <div className="space-y-3 text-sm text-ink-soft leading-relaxed pt-1">
            {activeMessage.paragraphs.map((p, idx) => (
              <p key={idx} className="text-justify">
                {p}
              </p>
            ))}
          </div>

          {/* Closing & Signature */}
          <div className="pt-3 border-t border-gold/30 text-center space-y-2">
            <div className="font-serif font-bold italic text-lg sm:text-xl text-maroon">
              {activeMessage.closing}
            </div>

            <div className="text-xs text-ink-soft whitespace-pre-line font-medium leading-normal bg-sand/40 p-2.5 rounded-lg border border-gold/25">
              {activeMessage.signature}
            </div>
          </div>

          {/* Action Buttons: RSVP and Return to Card */}
          <div className="pt-3 flex flex-col items-center gap-3">
            {!rsvped ? (
              <motion.button
                type="button"
                onClick={handleCelebrate}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-maroon via-[#9E3C41] to-gold-deep text-paper font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gold-light/40"
              >
                <Sparkles className="w-4 h-4 text-flame-core" />
                <span>I&rsquo;ll Be There &bull; Celebrate with Us</span>
                <Sparkles className="w-4 h-4 text-flame-core" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>We look forward to welcoming you! 🎊</span>
              </motion.div>
            )}

            <button
              type="button"
              onClick={onBackToCard}
              className="text-xs text-gold-deep hover:text-maroon font-semibold underline underline-offset-4 flex items-center gap-1.5 transition-colors pt-1"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Back to Invitation Card</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
