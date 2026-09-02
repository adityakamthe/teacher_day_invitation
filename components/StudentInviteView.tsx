"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Palette,
  Shirt,
  Users,
} from "lucide-react";
import BackgroundScene from "@/components/BackgroundScene";
import Envelope3D from "@/components/Envelope3D";
import TeamMessage from "@/components/TeamMessage";
import { SoundProvider, FloatingMuteButton, useSound } from "@/components/SoundController";

interface EventData {
  eventName: string;
  academicYear: string;
  college: string;
  trust: string;
  department: string;
  hostedBy: string;
  date: string;
  time: string;
  venue: string;
  dressCode?: string;
  dressCodeNote?: string;
  quote: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  message: {
    salutation: string;
    lead: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  studentMessage?: {
    salutation: string;
    lead: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
}

interface StudentInviteViewProps {
  event: EventData;
}

const PASTEL_SWATCHES = [
  { name: "Soft Pink", color: "#F8D7DA", border: "#F1B0B7", text: "#721C24" },
  { name: "Mint", color: "#D5F0E3", border: "#A7E0C5", text: "#155724" },
  { name: "Lavender", color: "#E6D9F5", border: "#CBB2EB", text: "#381E72" },
  { name: "Baby Blue", color: "#D6EAF8", border: "#AED6F1", text: "#1B4F72" },
  { name: "Peach", color: "#FDEBD0", border: "#FAD7A0", text: "#7E5109" },
];

function CornerOrnament({ className }: { className?: string }) {
  return (
    <div className={`absolute w-8 h-8 pointer-events-none opacity-85 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path d="M2 32 Q2 2 32 2" stroke="#B27F2E" strokeWidth="1.2" opacity="0.8" />
        <circle cx="6" cy="27" r="3" fill="#FF9142" />
        <circle cx="10" cy="21" r="2.4" fill="#FFD98A" />
        <circle cx="15" cy="15" r="2" fill="#B27F2E" />
        <circle cx="21" cy="10" r="2.4" fill="#FFD98A" />
        <circle cx="27" cy="6" r="3" fill="#FF9142" />
      </svg>
    </div>
  );
}

function StudentInvitationCard({
  event,
  onReadMessage,
  showMessageButton = true,
}: {
  event: EventData;
  onReadMessage: () => void;
  showMessageButton?: boolean;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 10, y: -py * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="w-full max-w-[460px] mx-auto perspective-container my-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <div className="relative w-full bg-gradient-to-b from-[#FFFDF8] via-[#FBF3E4] to-[#F7EBD4] rounded-2xl p-7 sm:p-9 border border-gold/50 shadow-card-warm overflow-hidden preserve-3d">
          {/* Subtle Paper Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cg fill='none' stroke='%238C6222' stroke-width='1'%3E%3Cpath d='M45 20 Q52 32 45 44 Q38 32 45 20 Z'/%3E%3Cpath d='M20 60 Q30 55 40 60 Q30 65 20 60 Z'/%3E%3Cpath d='M60 68 Q70 63 80 68 Q70 73 60 68 Z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "90px 90px",
            }}
          />

          {/* Double Gold Foil Border */}
          <div className="absolute inset-3 rounded-xl border border-gold/40 pointer-events-none" />
          <div className="absolute inset-4 rounded-[10px] border border-gold/20 pointer-events-none" />

          {/* Four Corner Ornaments */}
          <CornerOrnament className="top-4 left-4" />
          <CornerOrnament className="top-4 right-4 -scale-x-100" />
          <CornerOrnament className="bottom-4 left-4 -scale-y-100" />
          <CornerOrnament className="bottom-4 right-4 -scale-100" />

          {/* Card Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Header with Dual Logos (TSSM College & ACES Department) */}
            <div className="w-full flex items-center justify-between gap-2 sm:gap-3 pt-1">
              {/* Left Logo: TSSM College Emblem */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full p-1 bg-gradient-to-br from-sand/90 via-ivory to-sand/60 border border-gold/40 shadow-sm flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/logos/tssm-logo-clean.png"
                    alt="TSSM BSCOER College Logo"
                    width={52}
                    height={52}
                    className="object-contain max-h-[42px] sm:max-h-[50px] w-auto drop-shadow-xs"
                    priority
                  />
                </div>
                <span className="text-[9px] font-bold text-gold-deep tracking-wider uppercase mt-1">
                  TSSM
                </span>
              </div>

              {/* Center College & Department Details */}
              <div className="flex-1 text-center space-y-0.5 min-w-0 px-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-gold-deep font-semibold block leading-tight">
                  {event.trust}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-maroon leading-snug">
                  {event.college}
                </h3>
                <p className="text-[11px] sm:text-xs text-ink-soft tracking-wide font-medium">
                  {event.department}
                </p>
              </div>

              {/* Right Logo: ACES Association Emblem */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full p-1 bg-gradient-to-br from-sand/90 via-ivory to-sand/60 border border-gold/40 shadow-sm flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/logos/aces-logo-clean.png"
                    alt="ACES Students Association Logo"
                    width={52}
                    height={52}
                    className="object-contain max-h-[42px] sm:max-h-[50px] w-auto drop-shadow-xs"
                    priority
                  />
                </div>
                <span className="text-[9px] font-bold text-gold-deep tracking-wider uppercase mt-1">
                  ACES
                </span>
              </div>
            </div>

            {/* Traditional Lamp (Diya) with animated glow & flame */}
            <div className="relative py-1 flex flex-col items-center">
              <div className="absolute -top-1 w-20 h-16 rounded-full bg-flame/35 blur-md animate-glow-pulse pointer-events-none" />

              <svg width="56" height="52" viewBox="0 0 56 52" fill="none" className="relative z-10">
                <path d="M14 40 Q28 48 42 40 L38 34 Q28 38 18 34 Z" fill="#B27F2E" />
                <ellipse cx="28" cy="34" rx="14" ry="5" fill="#E8C77E" />
                <path d="M20 34 Q20 24 28 22 Q36 24 36 34" fill="none" stroke="#8C6222" strokeWidth="1.6" />
                <ellipse
                  cx="28"
                  cy="14"
                  rx="5.5"
                  ry="9"
                  fill="#FF9142"
                  className="animate-flicker origin-bottom"
                />
                <ellipse
                  cx="28"
                  cy="15"
                  rx="2.6"
                  ry="5"
                  fill="#FFD98A"
                  className="animate-flicker origin-bottom"
                />
              </svg>

              <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mt-2" />
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-maroon tracking-tight">
                Teacher&rsquo;s Day
              </h1>
              <div className="font-serif italic font-medium text-lg text-gold-deep flex items-center justify-center gap-2">
                <span className="w-6 h-[1px] bg-gold/40" />
                <span>Celebration &amp; Orientation</span>
                <span className="w-6 h-[1px] bg-gold/40" />
              </div>
            </div>

            {/* Recipient Header for Students */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sand/80 border border-gold/40 text-gold-deep text-[10px] uppercase font-bold tracking-widest mb-1 shadow-xs">
                <Users className="w-3 h-3 text-maroon" />
                <span>Student Community Invitation</span>
              </div>
              <h2 className="font-serif font-bold italic text-2xl sm:text-[25px] text-maroon tracking-wide">
                Dear Computer Department Students
              </h2>
              <span className="inline-block text-xs uppercase tracking-wider font-semibold text-ink-soft bg-sand/60 px-3.5 py-1 rounded-full border border-gold/30">
                All SE, TE &amp; BE Students &bull; BSCOER Pune
              </span>
            </div>

            {/* Warm Invitation Paragraph */}
            <p className="text-sm text-ink leading-relaxed max-w-[340px]">
              On behalf of the organizing committee, <b className="font-semibold text-maroon">{event.hostedBy}</b> cordially
              invites all students of Computer Engineering to come together to express our gratitude and honor the extraordinary dedication of our teachers!
            </p>

            {/* HIGHLIGHTED DRESS CODE SECTION */}
            <div className="w-full max-w-[360px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EA] to-[#F5ECDC] rounded-xl p-4 border-2 border-gold/45 shadow-sm space-y-3 text-center relative overflow-hidden">
              {/* Decorative top strip with subtle pastel shimmer */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F8D7DA] via-[#D5F0E3] via-[#E6D9F5] via-[#D6EAF8] to-[#FDEBD0]" />

              <div className="flex items-center justify-center gap-2 pt-0.5">
                <Shirt className="w-4 h-4 text-maroon animate-bounce" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-maroon tracking-normal">
                  ✨ Dress Code: Pastel Please! ✨
                </h3>
              </div>

              {/* Pastel Swatches Chips */}
              <div className="flex items-center justify-center gap-2 flex-wrap py-0.5">
                {PASTEL_SWATCHES.map((swatch) => (
                  <div
                    key={swatch.name}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-xs transition-transform duration-200 hover:scale-105 border"
                    style={{
                      backgroundColor: swatch.color,
                      borderColor: swatch.border,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-inner"
                      style={{ backgroundColor: swatch.border }}
                    />
                    <span
                      className="text-[11px] font-semibold tracking-wide"
                      style={{ color: swatch.text }}
                    >
                      {swatch.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dress code note */}
              <p className="text-xs text-ink-soft leading-relaxed italic px-1 font-medium">
                &ldquo;{event.dressCodeNote || "Come dressed in your favourite soft pastel shades and let's make the celebration as colorful as our gratitude!"}&rdquo;
              </p>
            </div>

            {/* Event Details Box */}
            <div className="w-full max-w-[360px] bg-paper/80 rounded-xl p-3.5 border border-gold/35 space-y-2.5 text-left shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sand/80 flex items-center justify-center flex-shrink-0 text-maroon border border-gold/30">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{event.date}</div>
                  <div className="text-[11px] text-ink-soft font-medium">Teacher&rsquo;s Day Grand Celebration</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sand/80 flex items-center justify-center flex-shrink-0 text-maroon border border-gold/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{event.time}</div>
                  <div className="text-[11px] text-maroon font-semibold">Kindly take your seats by 9:45 AM</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sand/80 flex items-center justify-center flex-shrink-0 text-maroon border border-gold/30">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{event.venue}</div>
                  <div className="text-[11px] text-ink-soft font-medium">BSCOER Campus, Pune</div>
                </div>
              </div>
            </div>

            {/* Sanskrit Shloka */}
            <div className="pt-1 pb-1 space-y-0.5">
              <div className="font-serif text-lg font-bold text-gold-deep tracking-wide">
                {event.quote.sanskrit}
              </div>
              <div className="text-[11.5px] italic text-ink-soft">
                {event.quote.transliteration}
              </div>
              <div className="text-[11px] text-ink-light">
                &ldquo;{event.quote.meaning}&rdquo;
              </div>
            </div>

            {/* Action Button: Read Special Message from Team Aces */}
            <div className="w-full flex flex-col items-center gap-2 pt-1">
              {showMessageButton && (
                <motion.button
                  type="button"
                  onClick={onReadMessage}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-[320px] py-3 px-6 rounded-full bg-gradient-to-r from-gold via-gold-deep to-maroon text-paper font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gold-light/40"
                >
                  <Heart className="w-4 h-4 text-flame-core fill-flame-core animate-pulse" />
                  <span>Read special note from Team Aces</span>
                  <Sparkles className="w-4 h-4 text-flame-core" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StudentInviteContent({ event }: StudentInviteViewProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "emerging" | "settled" | "message">("closed");
  const { playOpenSound, startAmbientPad } = useSound();
  const cardRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleOpenEnvelope = useCallback(async () => {
    if (stage !== "closed") return;

    // Start audio & chime
    await playOpenSound();

    setStage("opening");

    // Stage Choreography
    setTimeout(() => {
      setStage("emerging");
    }, 700);

    setTimeout(() => {
      setStage("settled");
      startAmbientPad();
    }, 1600);
  }, [stage, playOpenSound, startAmbientPad]);

  const handleReadMessage = () => {
    setStage("message");
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleBackToCard = () => {
    setStage("settled");
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <BackgroundScene />
      <FloatingMuteButton />

      <main className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        {/* Envelope Stage */}
        {(stage === "closed" || stage === "opening") && (
          <Envelope3D
            recipientName="Computer Department Students"
            designation="All SE, TE & BE Students"
            sender="Team Aces"
            stage={stage}
            onOpen={handleOpenEnvelope}
          />
        )}

        {/* Revealed Invitation Card Stage */}
        <AnimatePresence>
          {(stage === "emerging" || stage === "settled" || stage === "message") && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 50, scale: 0.88, rotateX: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
              }}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <StudentInvitationCard
                event={event}
                onReadMessage={handleReadMessage}
                showMessageButton={stage === "settled"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Special Team Note for Students */}
        <AnimatePresence>
          {stage === "message" && (
            <div ref={messageRef} className="w-full">
              <TeamMessage
                faculty={{
                  slug: "students",
                  name: "Computer Department Students",
                  designation: "All SE, TE & BE Classes",
                }}
                event={event}
                customMessage={
                  event.studentMessage || {
                    salutation: "Dear",
                    lead: "Let's come together to express our heartfelt gratitude and celebrate the amazing teachers of our department!",
                    paragraphs: [
                      "Teachers' Day is our special opportunity to honor the professors, lecturers, and staff who guide, inspire, and shape our future every single day.",
                      "Join us for an exciting morning of gratitude, interactive activities, and memorable moments with our faculty.",
                      "Please adhere to the Pastel Dress Code and ensure you take your seats in the Seminar Hall by 9:45 AM sharp.",
                    ],
                    closing: "See you all in your finest pastel attire!",
                    signature: "With enthusiasm & unity,\nTeam Aces (Computer Engineering Students)",
                  }
                }
                sender="Team Aces"
                onBackToCard={handleBackToCard}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 mt-8 text-center text-xs text-ink-soft/70">
        <p>
          Organized with enthusiasm by <span className="font-semibold text-maroon">Team Aces</span> &bull; {event.department} &bull; {event.academicYear}
        </p>
      </footer>
    </div>
  );
}

export default function StudentInviteView(props: StudentInviteViewProps) {
  return (
    <SoundProvider>
      <StudentInviteContent {...props} />
    </SoundProvider>
  );
}
