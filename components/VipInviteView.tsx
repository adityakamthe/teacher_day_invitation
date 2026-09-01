"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundScene from "@/components/BackgroundScene";
import Envelope3D from "@/components/Envelope3D";
import InvitationCard from "@/components/InvitationCard";
import TeamMessage from "@/components/TeamMessage";
import { SoundProvider, FloatingMuteButton, useSound } from "@/components/SoundController";

interface VipGuest {
  slug: string;
  name: string;
  designation: string;
  photo?: string | null;
  sender: string;
  salutation: string;
  lead: string;
  paragraphs: string[];
  closing: string;
  signature: string;
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

interface VipInviteViewProps {
  vip: VipGuest;
  event: EventData;
}

function VipInviteContent({ vip, event }: VipInviteViewProps) {
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
            recipientName={vip.name}
            designation={vip.designation}
            sender={vip.sender}
            isVip={true}
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
                faculty={{
                  slug: vip.slug,
                  name: vip.name,
                  designation: vip.designation,
                  photo: vip.photo,
                }}
                event={event}
                sender={vip.sender}
                isVip={true}
                customButtonLabel="Read personal note from HOD"
                onReadMessage={handleReadMessage}
                showMessageButton={stage === "settled"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Personal Note from HOD */}
        <AnimatePresence>
          {stage === "message" && (
            <div ref={messageRef} className="w-full">
              <TeamMessage
                faculty={{
                  slug: vip.slug,
                  name: vip.name,
                  designation: vip.designation,
                }}
                event={event}
                customMessage={{
                  salutation: vip.salutation,
                  lead: vip.lead,
                  paragraphs: vip.paragraphs,
                  closing: vip.closing,
                  signature: vip.signature,
                }}
                sender={vip.sender}
                isVip={true}
                onBackToCard={handleBackToCard}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 mt-8 text-center text-xs text-ink-soft/70">
        <p>
          Honoring our respected dignitaries &bull; <span className="font-semibold text-maroon">{event.department}</span> &bull; {event.academicYear}
        </p>
      </footer>
    </div>
  );
}

export default function VipInviteView(props: VipInviteViewProps) {
  return (
    <SoundProvider>
      <VipInviteContent {...props} />
    </SoundProvider>
  );
}
