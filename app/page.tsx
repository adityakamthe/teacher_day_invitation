import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import BackgroundScene from "@/components/BackgroundScene";
import eventData from "@/data/event.json";
import facultyData from "@/data/faculty.json";

export default function HomePage() {
  const firstFaculty = facultyData[0];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <BackgroundScene />

      <div className="relative z-10 max-w-xl mx-auto space-y-6 bg-paper/85 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-gold/50 shadow-card-warm">
        {/* Dual Logos */}
        <div className="flex items-center justify-center gap-6 pb-1">
          <div className="relative w-14 h-14 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-sm flex items-center justify-center">
            <Image
              src="/logos/tssm-logo-clean.png"
              alt="TSSM BSCOER Logo"
              width={56}
              height={56}
              className="object-contain max-h-[46px] w-auto drop-shadow-xs"
              priority
            />
          </div>
          <div className="w-[1px] h-10 bg-gold/30" />
          <div className="relative w-14 h-14 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-sm flex items-center justify-center">
            <Image
              src="/logos/aces-logo-clean.png"
              alt="ACES Logo"
              width={56}
              height={56}
              className="object-contain max-h-[46px] w-auto drop-shadow-xs"
              priority
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light/30 border border-gold/40 text-maroon text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-flame" />
          <span>{eventData.hostedBy} &bull; {eventData.academicYear}</span>
        </div>

        {/* Diya SVG Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -top-1 w-16 h-12 rounded-full bg-flame/30 blur-md animate-pulse pointer-events-none" />
            <svg width="60" height="54" viewBox="0 0 56 52" fill="none">
              <path d="M14 40 Q28 48 42 40 L38 34 Q28 38 18 34 Z" fill="#B27F2E" />
              <ellipse cx="28" cy="34" rx="14" ry="5" fill="#E8C77E" />
              <path d="M20 34 Q20 24 28 22 Q36 24 36 34" fill="none" stroke="#8C6222" strokeWidth="1.6" />
              <ellipse cx="28" cy="14" rx="5.5" ry="9" fill="#FF9142" />
              <ellipse cx="28" cy="15" rx="2.6" ry="5" fill="#FFD98A" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-maroon tracking-tight">
            Teacher&rsquo;s Day 2026
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-gold-deep">
            A 3D Personalized Invitation from Team Aces
          </p>
        </div>

        {/* College & Department */}
        <div className="space-y-1 text-sm text-ink-soft">
          <p className="font-semibold text-ink">{eventData.college}</p>
          <p>{eventData.department}</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/invite"
            className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-gold via-gold-deep to-maroon text-paper font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gold-light/40"
          >
            <span>Faculty &amp; VIP Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/invite/students"
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-sand/80 hover:bg-sand border border-gold/50 text-maroon font-semibold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-flame" />
            <span>Student Invite &bull; Pastel Dress Code</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
