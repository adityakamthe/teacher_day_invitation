"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Copy, Check, ExternalLink, Share2, Sparkles, Crown } from "lucide-react";
import facultyData from "@/data/faculty.json";
import vipData from "@/data/vip.json";
import eventData from "@/data/event.json";
import BackgroundScene from "@/components/BackgroundScene";

export default function InviteIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredVips = vipData.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaculty = facultyData.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teachingFaculty = filteredFaculty.filter((f) => f.category === "Teaching Faculty");
  const technicalStaff = filteredFaculty.filter((f) => f.category === "Technical Assistant");

  const copyLink = (path: string, key: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${path}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(key);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const getVipWhatsAppShareUrl = (name: string, slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invite/vip/${slug}`;
    const text = `Respected ${name}, Dr. M. N. Jadhav (HOD, Computer Engineering) warmly invites you to celebrate Teacher's Day 2026! Here is your special invitation: ${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppShareUrl = (name: string, slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invite/${slug}`;
    const text = `Respected ${name}, Team Aces warmly invites you to celebrate Teacher's Day 2026! Here is your personalized invitation: ${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <BackgroundScene />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 bg-paper/85 backdrop-blur-md p-8 rounded-3xl border border-gold/40 shadow-card-warm">
          {/* Dual Logos */}
          <div className="flex items-center justify-center gap-5 pb-1">
            <div className="relative w-12 h-12 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-sm flex items-center justify-center">
              <Image
                src="/logos/tssm-logo-clean.png"
                alt="TSSM BSCOER Logo"
                width={48}
                height={48}
                className="object-contain max-h-[38px] w-auto drop-shadow-xs"
                priority
              />
            </div>
            <div className="w-[1px] h-8 bg-gold/30" />
            <div className="relative w-12 h-12 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-sm flex items-center justify-center">
              <Image
                src="/logos/aces-logo-clean.png"
                alt="ACES Logo"
                width={48}
                height={48}
                className="object-contain max-h-[38px] w-auto drop-shadow-xs"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light/25 border border-gold/40 text-gold-deep text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teachers&rsquo; Day 2026 &bull; Distribution Directory</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-maroon">
            Teacher&rsquo;s Day 2026 &mdash; Faculty &amp; Dignitary Invitation Directory
          </h1>

          <p className="text-sm text-ink-soft max-w-2xl mx-auto">
            Personalized shareable links for VIP Dignitaries and all 24 faculty/staff members of the Department of Computer Engineering (BSCOER, Pune).
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60" />
            <input
              type="text"
              placeholder="Search by name or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-sand/40 border border-gold/40 text-ink text-sm placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:bg-paper"
            />
          </div>
        </div>

        {/* VIP Dignitaries & Leadership Section */}
        {filteredVips.length > 0 && (
          <div className="space-y-4 bg-gradient-to-r from-sand/30 via-gold-light/20 to-sand/30 p-6 rounded-3xl border border-gold/40 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gold/30 pb-3">
              <Crown className="w-6 h-6 text-gold-deep" />
              <h2 className="font-serif font-bold text-2xl text-maroon">
                Dignitaries &amp; Leadership &mdash; VIP Invitations ({filteredVips.length})
              </h2>
              <span className="ml-auto text-xs font-semibold text-gold-deep bg-sand px-3 py-1 rounded-full border border-gold/30">
                From Dr. M. N. Jadhav (HOD)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredVips.map((v) => (
                <div
                  key={v.slug}
                  className="bg-paper/95 backdrop-blur-md rounded-2xl p-4 border border-gold/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-deep bg-gradient-to-br from-gold-light/40 to-sand flex items-center justify-center font-serif font-bold text-maroon text-lg shadow-inner">
                      {v.name.replace(/^(The\s|Dr\.\s|Prof\.\s)/i, "").slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-gold-deep font-bold uppercase tracking-wider">
                        VIP &bull; /invite/vip/{v.slug}
                      </div>
                      <h3 className="font-serif font-bold text-base text-maroon truncate" title={v.name}>
                        {v.name}
                      </h3>
                      <p className="text-xs text-ink-soft truncate font-medium" title={v.designation}>
                        {v.designation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gold/20">
                    <button
                      type="button"
                      onClick={() => copyLink(`/invite/vip/${v.slug}`, `vip-${v.slug}`)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-sand/60 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1.5 border border-gold/40 transition"
                    >
                      {copiedSlug === `vip-${v.slug}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gold-deep" />
                          <span>Copy VIP Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getVipWhatsAppShareUrl(v.name, v.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition"
                      title="Share via WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>

                    <Link
                      href={`/invite/vip/${v.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-maroon border border-gold/40 transition"
                      title="Preview VIP Invitation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teaching Faculty Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-2">
            <h2 className="font-serif font-bold text-2xl text-maroon">
              Teaching Faculty ({teachingFaculty.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachingFaculty.map((f) => (
              <FacultyCard
                key={f.slug}
                faculty={f}
                isCopied={copiedSlug === f.slug}
                onCopy={() => copyLink(`/invite/${f.slug}`, f.slug)}
                whatsAppUrl={getWhatsAppShareUrl(f.name, f.slug)}
              />
            ))}
          </div>
        </div>

        {/* Technical Assistants Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-2">
            <h2 className="font-serif font-bold text-2xl text-maroon">
              Technical Staff ({technicalStaff.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalStaff.map((f) => (
              <FacultyCard
                key={f.slug}
                faculty={f}
                isCopied={copiedSlug === f.slug}
                onCopy={() => copyLink(`/invite/${f.slug}`, f.slug)}
                whatsAppUrl={getWhatsAppShareUrl(f.name, f.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultyCard({
  faculty,
  isCopied,
  onCopy,
  whatsAppUrl,
}: {
  faculty: {
    id: number;
    slug: string;
    name: string;
    designation: string;
    photo?: string | null;
  };
  isCopied: boolean;
  onCopy: () => void;
  whatsAppUrl: string;
}) {
  return (
    <div className="bg-paper/90 backdrop-blur-md rounded-2xl p-4 border border-gold/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
      <div className="flex items-center gap-3.5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold/40 bg-sand/60">
          {faculty.photo ? (
            <Image
              src={faculty.photo}
              alt={faculty.name}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif font-bold text-maroon text-lg">
              {faculty.name.slice(0, 2)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-mono text-gold-deep font-semibold">
            #{faculty.id.toString().padStart(2, "0")} &bull; /invite/{faculty.slug}
          </div>
          <h3 className="font-serif font-bold text-base text-maroon truncate" title={faculty.name}>
            {faculty.name}
          </h3>
          <p className="text-xs text-ink-soft truncate" title={faculty.designation}>
            {faculty.designation}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gold/20">
        <button
          type="button"
          onClick={onCopy}
          className="flex-1 py-1.5 px-3 rounded-lg bg-sand/50 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1.5 border border-gold/30 transition"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gold-deep" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition"
          title="Share via WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </a>

        <Link
          href={`/invite/${faculty.slug}`}
          target="_blank"
          className="p-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-maroon border border-gold/30 transition"
          title="Preview Invitation"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
