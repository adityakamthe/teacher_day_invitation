"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Sparkles,
  Crown,
  QrCode as QrIcon,
  Download,
  Grid,
  List,
  FileArchive,
  GraduationCap,
  Shirt,
  Users
} from "lucide-react";
import JSZip from "jszip";
import facultyData from "@/data/faculty.json";
import vipData from "@/data/vip.json";
import eventData from "@/data/event.json";
import BackgroundScene from "@/components/BackgroundScene";
import QrInviteModal, { QrPerson } from "@/components/QrInviteModal";
import { generateQrCardBlob } from "@/lib/qrCardGenerator";

export default function InviteIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedQrPerson, setSelectedQrPerson] = useState<QrPerson | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "qr-gallery">("directory");
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

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

  const getStudentWhatsAppShareUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invite/students`;
    const text = `Dear Computer Department Students (SE, TE & BE), Team Aces warmly invites you to celebrate Teacher's Day 2026! ✨\n\n✨ Dress Code: Pastel Colors 🎨\nDate: ${eventData.date}\nTime: ${eventData.time}\nVenue: ${eventData.venue}\n\nOpen your 3D envelope invitation here: ${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
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

  const openQrModal = (person: QrPerson) => {
    setSelectedQrPerson(person);
    setIsQrModalOpen(true);
  };

  const handleDownloadAllZippedQrs = async () => {
    setIsZipping(true);
    setZipProgress(0);

    try {
      const zip = new JSZip();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://teachers-day-invite.vercel.app";
      const totalItems = vipData.length + facultyData.length + 1;
      let completed = 0;

      // 0. Student Community Card
      const studentFolder = zip.folder("00_Student_Invitation");
      const studentBlob = await generateQrCardBlob(
        {
          slug: "students",
          name: "Computer Dept Students",
          designation: "All SE, TE & BE Students",
          isVip: false,
        },
        origin
      );
      studentFolder?.file("00_Student_Community_Pastel_Invite_QR.png", studentBlob);
      completed++;
      setZipProgress(Math.round((completed / totalItems) * 100));

      // 1. VIP Cards
      const vipFolder = zip.folder("01_VIP_Dignitaries");
      for (const vip of vipData) {
        const blob = await generateQrCardBlob(
          {
            slug: vip.slug,
            name: vip.name,
            designation: vip.designation,
            isVip: true,
          },
          origin
        );
        const cleanName = vip.name.replace(/[^a-zA-Z0-9]/g, "_");
        vipFolder?.file(`VIP_${cleanName}_QR_Invite.png`, blob);
        completed++;
        setZipProgress(Math.round((completed / totalItems) * 100));
      }

      // 2. Faculty Cards
      const facultyFolder = zip.folder("02_Faculty_and_Staff");
      for (const f of facultyData) {
        const blob = await generateQrCardBlob(
          {
            id: f.id,
            slug: f.slug,
            name: f.name,
            designation: f.designation,
            category: f.category,
            isVip: false,
          },
          origin
        );
        const cleanName = f.name.replace(/[^a-zA-Z0-9]/g, "_");
        const prefix = f.id.toString().padStart(2, "0");
        facultyFolder?.file(`${prefix}_${cleanName}_QR_Invite.png`, blob);
        completed++;
        setZipProgress(Math.round((completed / totalItems) * 100));
      }

      // Generate Zip & Trigger Download
      const zipContent = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipContent);
      a.download = `Teachers_Day_2026_All_QR_Invitations.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error creating ZIP of QR codes:", err);
      alert("An error occurred while packaging QR cards. Please try again.");
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <BackgroundScene />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 bg-paper/90 backdrop-blur-md p-8 rounded-3xl border border-gold/40 shadow-card-warm">
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
            <span>Teachers&rsquo; Day 2026 &bull; Invitation Hub &amp; QR Distribution</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-maroon">
            Teacher&rsquo;s Day 2026 &mdash; QR Codes &amp; Invitation Directory
          </h1>

          <p className="text-sm text-ink-soft max-w-2xl mx-auto">
            Personalized shareable links and high-definition QR code passes for VIP Dignitaries and all 24 faculty/staff members of Computer Engineering (BSCOER, Pune).
          </p>

          {/* Quick Actions & Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* View Mode Buttons */}
            <div className="inline-flex p-1 rounded-full bg-sand/60 border border-gold/40">
              <button
                type="button"
                onClick={() => setActiveTab("directory")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  activeTab === "directory"
                    ? "bg-maroon text-paper shadow-sm"
                    : "text-ink hover:text-maroon"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Directory Links</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("qr-gallery")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  activeTab === "qr-gallery"
                    ? "bg-maroon text-paper shadow-sm"
                    : "text-ink hover:text-maroon"
                }`}
              >
                <QrIcon className="w-3.5 h-3.5" />
                <span>QR Code Cards ({vipData.length + facultyData.length})</span>
              </button>
            </div>

            {/* Batch ZIP Download Button */}
            <button
              type="button"
              onClick={handleDownloadAllZippedQrs}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-deep to-maroon text-paper text-xs font-bold shadow hover:shadow-md transition hover:scale-[1.02] border border-gold-light/40"
              title="Download all QR codes as a single zip archive"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isZipping ? `Generating ZIP (${zipProgress}%)...` : "Download All QR Cards (ZIP)"}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-3 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60" />
            <input
              type="text"
              placeholder="Search faculty or dignitary by name or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-sand/40 border border-gold/40 text-ink text-sm placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:bg-paper"
            />
          </div>
        </div>

        {/* TAB 1: Standard Directory View */}
        {activeTab === "directory" && (
          <div className="space-y-8">
            {/* Student Community & Pastel Dress Code Invitation Banner */}
            <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 p-6 rounded-3xl border-2 border-gold/50 shadow-card-warm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-maroon border border-gold/40">
                    <Users className="w-5 h-5 text-maroon" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gold-deep uppercase tracking-widest block">
                      General Student Audience Invitation
                    </span>
                    <h2 className="font-serif font-bold text-2xl text-maroon">
                      Computer Dept Students &mdash; All SE, TE &amp; BE
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/80 border border-gold/40 text-xs font-semibold text-maroon self-start sm:self-auto">
                  <Shirt className="w-3.5 h-3.5 text-flame" />
                  <span>Dress Code: <b>Pastel Colors</b></span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <p className="text-xs text-ink-soft leading-relaxed">
                    A shared, beautifully animated 3D invitation card for all students of Computer Engineering with dedicated pastel dress code swatches, celebration schedule, and Team Aces message note.
                  </p>
                  
                  {/* Swatches preview */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-ink-soft">Palette:</span>
                    {[
                      { name: "Pink", color: "#F8D7DA", text: "#721C24" },
                      { name: "Mint", color: "#D5F0E3", text: "#155724" },
                      { name: "Lavender", color: "#E6D9F5", text: "#381E72" },
                      { name: "Baby Blue", color: "#D6EAF8", text: "#1B4F72" },
                      { name: "Peach", color: "#FDEBD0", text: "#7E5109" },
                    ].map((s) => (
                      <span
                        key={s.name}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: s.color, color: s.text }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      openQrModal({
                        slug: "students",
                        name: "Computer Dept Students",
                        designation: "All SE, TE & BE Students",
                        isVip: false,
                        sender: "Team Aces",
                      })
                    }
                    className="py-2 px-3 rounded-xl bg-gold/15 hover:bg-gold/25 text-xs font-bold text-maroon flex items-center gap-1.5 border border-gold/30 transition"
                  >
                    <QrIcon className="w-4 h-4 text-gold-deep" />
                    <span>QR Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyLink("/invite/students", "students")}
                    className="py-2 px-3.5 rounded-xl bg-sand/60 hover:bg-sand text-xs font-semibold text-ink flex items-center gap-1.5 border border-gold/30 transition"
                  >
                    {copiedSlug === "students" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gold-deep" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getStudentWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-paper text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    title="Share to Student WhatsApp Groups"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share to Students</span>
                  </a>

                  <Link
                    href="/invite/students"
                    target="_blank"
                    className="py-2 px-4 rounded-xl bg-maroon hover:bg-maroon-deep text-paper text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Preview Card</span>
                  </Link>
                </div>
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-light/40 to-sand border-2 border-gold-deep flex items-center justify-center flex-shrink-0 text-maroon shadow-xs">
                          <Crown className="w-6 h-6 text-gold-deep" />
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
                          onClick={() =>
                            openQrModal({
                              slug: v.slug,
                              name: v.name,
                              designation: v.designation,
                              isVip: true,
                              sender: v.sender,
                            })
                          }
                          className="py-1.5 px-2.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-xs font-bold text-maroon flex items-center justify-center gap-1 border border-gold/40 transition"
                          title="Generate and download VIP QR Code"
                        >
                          <QrIcon className="w-3.5 h-3.5 text-gold-deep" />
                          <span>QR Pass</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyLink(`/invite/vip/${v.slug}`, `vip-${v.slug}`)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-sand/60 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1 border border-gold/40 transition"
                        >
                          {copiedSlug === `vip-${v.slug}` ? (
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
                <GraduationCap className="w-6 h-6 text-gold-deep" />
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
                    onOpenQr={() =>
                      openQrModal({
                        slug: f.slug,
                        name: f.name,
                        designation: f.designation,
                        photo: f.photo,
                        category: f.category,
                        isVip: false,
                      })
                    }
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
                    onOpenQr={() =>
                      openQrModal({
                        slug: f.slug,
                        name: f.name,
                        designation: f.designation,
                        photo: f.photo,
                        category: f.category,
                        isVip: false,
                      })
                    }
                    whatsAppUrl={getWhatsAppShareUrl(f.name, f.slug)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QR Gallery Grid (Direct QR Cards) */}
        {activeTab === "qr-gallery" && (
          <div className="space-y-8">
            {/* Student Community QR Pass */}
            <div className="space-y-4 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 p-6 rounded-3xl border-2 border-gold/50 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gold/30 pb-2">
                <Users className="w-5 h-5 text-maroon" />
                <h2 className="font-serif font-bold text-xl text-maroon">
                  Student Community QR Pass &mdash; All SE, TE &amp; BE
                </h2>
                <span className="ml-auto text-xs font-semibold text-gold-deep bg-sand/80 px-3 py-1 rounded-full border border-gold/30">
                  ✨ Pastel Dress Code
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <QrGridCard
                  person={{
                    slug: "students",
                    name: "Computer Dept Students",
                    designation: "All SE, TE & BE Students",
                    isVip: false,
                  }}
                  onOpenModal={() =>
                    openQrModal({
                      slug: "students",
                      name: "Computer Dept Students",
                      designation: "All SE, TE & BE Students",
                      isVip: false,
                    })
                  }
                  whatsAppUrl={getStudentWhatsAppShareUrl()}
                />
              </div>
            </div>

            {/* VIP QR Cards */}
            {filteredVips.length > 0 && (
              <div className="space-y-4 bg-sand/30 p-6 rounded-3xl border border-gold/40">
                <div className="flex items-center gap-2 border-b border-gold/30 pb-2">
                  <Crown className="w-5 h-5 text-gold-deep" />
                  <h2 className="font-serif font-bold text-xl text-maroon">
                    VIP Dignitary QR Passes ({filteredVips.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVips.map((v) => (
                    <QrGridCard
                      key={v.slug}
                      person={{
                        slug: v.slug,
                        name: v.name,
                        designation: v.designation,
                        isVip: true,
                      }}
                      onOpenModal={() =>
                        openQrModal({
                          slug: v.slug,
                          name: v.name,
                          designation: v.designation,
                          isVip: true,
                        })
                      }
                      whatsAppUrl={getVipWhatsAppShareUrl(v.name, v.slug)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Faculty & Staff QR Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gold/30 pb-2">
                <QrIcon className="w-5 h-5 text-gold-deep" />
                <h2 className="font-serif font-bold text-xl text-maroon">
                  Faculty &amp; Staff QR Passes ({filteredFaculty.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFaculty.map((f) => (
                  <QrGridCard
                    key={f.slug}
                    person={{
                      id: f.id,
                      slug: f.slug,
                      name: f.name,
                      designation: f.designation,
                      photo: f.photo,
                      category: f.category,
                      isVip: false,
                    }}
                    onOpenModal={() =>
                      openQrModal({
                        slug: f.slug,
                        name: f.name,
                        designation: f.designation,
                        photo: f.photo,
                        category: f.category,
                        isVip: false,
                      })
                    }
                    whatsAppUrl={getWhatsAppShareUrl(f.name, f.slug)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global QR Code Modal */}
      <QrInviteModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        person={selectedQrPerson}
      />
    </div>
  );
}

function FacultyCard({
  faculty,
  isCopied,
  onCopy,
  onOpenQr,
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
  onOpenQr: () => void;
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
          onClick={onOpenQr}
          className="py-1.5 px-2.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-xs font-bold text-maroon flex items-center justify-center gap-1 border border-gold/30 transition"
          title="View & Download QR Pass"
        >
          <QrIcon className="w-3.5 h-3.5 text-gold-deep" />
          <span>QR Pass</span>
        </button>

        <button
          type="button"
          onClick={onCopy}
          className="flex-1 py-1.5 px-2 rounded-lg bg-sand/50 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1 border border-gold/30 transition"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gold-deep" />
              <span>Copy</span>
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

function QrGridCard({
  person,
  onOpenModal,
  whatsAppUrl,
}: {
  person: QrPerson & { id?: number };
  onOpenModal: () => void;
  whatsAppUrl: string;
}) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteUrl = person.isVip ? `${origin}/invite/vip/${person.slug}` : `${origin}/invite/${person.slug}`;
  const staticQrSrc = person.isVip
    ? `/qr-codes/vip_${person.slug}.png`
    : `/qr-codes/faculty_${(person.id || 0).toString().padStart(2, "0")}_${person.slug}.png`;

  return (
    <div className="bg-paper/95 backdrop-blur-md rounded-2xl p-5 border border-gold/40 shadow-card-warm flex flex-col items-center text-center space-y-3 hover:shadow-lg transition">
      <div className="w-full flex items-center justify-between border-b border-gold/20 pb-2">
        <span className="text-[10px] font-mono text-gold-deep font-bold uppercase">
          {person.isVip ? "VIP PASS" : `#${person.id?.toString().padStart(2, "0")}`}
        </span>
        <span className="text-[10px] text-ink-soft truncate max-w-[140px]">
          {person.isVip ? `/invite/vip/${person.slug}` : `/invite/${person.slug}`}
        </span>
      </div>

      <div className="space-y-0.5">
        <h3 className="font-serif font-bold text-base text-maroon truncate max-w-[240px]" title={person.name}>
          {person.name}
        </h3>
        <p className="text-xs text-ink-soft truncate max-w-[240px]" title={person.designation}>
          {person.designation}
        </p>
      </div>

      {/* QR Image Box */}
      <div
        onClick={onOpenModal}
        className="cursor-pointer p-2.5 bg-white rounded-xl border border-gold/40 shadow-xs hover:scale-105 transition transform duration-200"
        title="Click to view & download full invitation card"
      >
        <img
          src={staticQrSrc}
          alt={`QR Code for ${person.name}`}
          className="w-40 h-40 object-contain rounded-md"
          onError={(e) => {
            // fallback to dynamic generator if file not found
            (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=6B-1D-2F&data=${encodeURIComponent(
              inviteUrl
            )}`;
          }}
        />
      </div>

      <p className="text-[11px] text-ink-light font-medium">Scan with camera to open invite</p>

      {/* Actions */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-gold/20">
        <button
          type="button"
          onClick={onOpenModal}
          className="py-1.5 px-2 rounded-lg bg-gold/20 hover:bg-gold/30 text-maroon text-xs font-bold flex items-center justify-center gap-1 border border-gold/40 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Card PNG</span>
        </button>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-300 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
