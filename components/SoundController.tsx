"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import { Volume2, VolumeX } from "lucide-react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playOpenSound: () => Promise<void>;
  startAmbientPad: () => void;
  ensureAudio: () => Promise<void>;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioReady = useRef(false);
  const padActive = useRef(false);
  const toneObjects = useRef<{
    reverb?: Tone.Reverb;
    bell?: Tone.PolySynth;
    pad?: Tone.PolySynth;
    ambientLoop?: Tone.Loop;
  }>({});

  useEffect(() => {
    return () => {
      // Clean up Tone synths on unmount
      try {
        const { reverb, bell, pad, ambientLoop } = toneObjects.current;
        ambientLoop?.dispose();
        bell?.dispose();
        pad?.dispose();
        reverb?.dispose();
      } catch {
        // ignore
      }
    };
  }, []);

  const ensureAudio = useCallback(async () => {
    if (audioReady.current) return;
    try {
      await Tone.start();
      const reverb = new Tone.Reverb({ decay: 4.2, wet: 0.38 }).toDestination();
      await reverb.generate();

      const bell = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.45, sustain: 0.12, release: 2.0 },
      }).connect(reverb);
      bell.volume.value = -7;

      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 2.5, decay: 1.5, sustain: 0.8, release: 4.5 },
      }).connect(reverb);
      pad.volume.value = -23;

      toneObjects.current = { reverb, bell, pad };
      audioReady.current = true;
    } catch (e) {
      console.warn("Audio initialization note:", e);
    }
  }, []);

  const playOpenSound = useCallback(async () => {
    await ensureAudio();
    const { bell, pad } = toneObjects.current;
    if (!bell || !pad) return;

    try {
      const now = Tone.now();
      // Melodic festive chime progression (Pentatonic C Major: C5 -> E5 -> G5 -> B5 -> C6)
      bell.triggerAttackRelease("C5", "8n", now);
      bell.triggerAttackRelease("E5", "8n", now + 0.14);
      bell.triggerAttackRelease("G5", "8n", now + 0.28);
      bell.triggerAttackRelease("B5", "8n", now + 0.42);
      bell.triggerAttackRelease("C6", "4n", now + 0.56);

      // Warm backing swell
      pad.triggerAttackRelease(["C3", "G3", "E4"], "4m", now + 0.1);
    } catch {
      // ignore
    }
  }, [ensureAudio]);

  const startAmbientPad = useCallback(() => {
    if (padActive.current || !audioReady.current) return;
    padActive.current = true;

    try {
      const { pad, bell } = toneObjects.current;
      if (!pad) return;

      const chords = [
        ["C3", "G3", "C4", "E4"],
        ["F3", "C4", "E4", "A4"],
        ["A2", "E3", "A3", "C4"],
        ["G2", "D3", "G3", "B3"],
      ];
      let chordIndex = 0;

      // Soft ambient loop repeating every 6 seconds
      const loop = new Tone.Loop((time) => {
        if (!padActive.current) return;
        const currentChord = chords[chordIndex % chords.length];
        pad.triggerAttackRelease(currentChord, "5s", time);
        
        // Occasional soft single bell sparkle
        if (bell && chordIndex % 2 === 1) {
          const sparkleNote = ["E5", "G5", "C6"][chordIndex % 3];
          bell.triggerAttackRelease(sparkleNote, "4n", time + 2.5);
        }
        chordIndex++;
      }, "6s").start(Tone.now() + 0.5);

      Tone.Transport.start();
      toneObjects.current.ambientLoop = loop;
    } catch {
      // ignore
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        Tone.Destination.mute = next;
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playOpenSound,
        startAmbientPad,
        ensureAudio,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function FloatingMuteButton() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-paper/85 backdrop-blur-md border border-gold/40 text-maroon shadow-md hover:bg-paper hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      title={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-maroon/70" />
      ) : (
        <Volume2 className="w-5 h-5 text-maroon animate-pulse" />
      )}
    </button>
  );
}
