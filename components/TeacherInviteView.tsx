"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundScene from "@/components/BackgroundScene";
import Envelope3D from "@/components/Envelope3D";
import InvitationCard from "@/components/InvitationCard";
import TeamMessage from "@/components/TeamMessage";
import { SoundProvider, FloatingMuteButton, useSound } from "@/components/SoundController";

interface FacultyMember {
  id: number;
  slug: string;
  name: string;
  designation: string;
  photo?: string | null;
  category: string;
}

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
}

interface TeacherInviteViewProps {
  faculty: FacultyMember;
  event: EventData;
}

function TeacherInviteContent({ faculty, event }: TeacherInviteViewProps) {
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
            recipientName={faculty.name}
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
              <InvitationCard
                faculty={faculty}
                event={event}
                onReadMessage={handleReadMessage}
                showMessageButton={stage === "settled"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Personal Team Message Card */}
        <AnimatePresence>
          {stage === "message" && (
            <div ref={messageRef} className="w-full">
              <TeamMessage
                faculty={faculty}
                event={event}
                onBackToCard={handleBackToCard}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 mt-8 text-center text-xs text-ink-soft/70">
        <p>Crafted with heartfelt gratitude by <span className="font-semibold text-maroon">Team Aces</span> &bull; {event.academicYear}</p>
      </footer>
    </div>
  );
}

export default function TeacherInviteView(props: TeacherInviteViewProps) {
  return (
    <SoundProvider>
      <TeacherInviteContent {...props} />
    </SoundProvider>
  );
}
