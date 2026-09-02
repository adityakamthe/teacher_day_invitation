"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { X, Download, Share2, Copy, Check, ExternalLink, Printer, QrCode as QrIcon, Sparkles } from "lucide-react";
import eventData from "@/data/event.json";

export interface QrPerson {
  slug: string;
  name: string;
  designation: string;
  photo?: string | null;
  category?: string;
  isVip?: boolean;
  sender?: string;
}

interface QrInviteModalProps {
  person: QrPerson | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QrInviteModal({ person, isOpen, onClose }: QrInviteModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getFullUrl = () => {
    if (!person) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://teachers-day-invite.vercel.app";
    if (person.slug === "students") return `${origin}/invite/students`;
    return person.isVip ? `${origin}/invite/vip/${person.slug}` : `${origin}/invite/${person.slug}`;
  };

  const fullUrl = getFullUrl();

  useEffect(() => {
    if (!person || !isOpen) return;

    // Generate high-resolution QR code
    QRCode.toDataURL(fullUrl, {
      width: 400,
      margin: 1.5,
      color: {
        dark: "#6B1D2F", // Royal Maroon
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [person, isOpen, fullUrl]);

  if (!isOpen || !person) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppShareUrl = () => {
    const text = person.isVip
      ? `Respected ${person.name}, Dr. M. N. Jadhav (HOD, Computer Engineering) warmly invites you to celebrate Teacher's Day 2026! Scan this QR code or open your special invitation here: ${fullUrl}`
      : `Respected ${person.name}, Team Aces warmly invites you to celebrate Teacher's Day 2026! Scan this QR code or open your personalized 3D invitation: ${fullUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const cleanName = person.name.replace(/[^a-zA-Z0-9]/g, "_");
    a.download = `QR_${person.isVip ? "VIP" : "Faculty"}_${cleanName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadFullCard = async () => {
    setIsGeneratingCard(true);
    try {
      // Draw a high-res 800x1200 card onto an offscreen canvas
      const width = 800;
      const height = 1100;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Background Gradient (Ivory Sand)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#FFFDF8");
      grad.addColorStop(0.5, "#FDF6EA");
      grad.addColorStop(1, "#F7EBD4");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Borders (Gold Foil & Maroon)
      ctx.strokeStyle = "#B27F2E";
      ctx.lineWidth = 6;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      ctx.strokeStyle = "#6B1D2F";
      ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, width - 68, height - 68);

      // 3. College & Trust Header
      ctx.fillStyle = "#8C6222";
      ctx.font = "bold 16px 'Cinzel', serif, Georgia";
      ctx.textAlign = "center";
      ctx.fillText(eventData.trust.toUpperCase(), width / 2, 85);

      ctx.fillStyle = "#6B1D2F";
      ctx.font = "bold 26px 'Cinzel', serif, Georgia";
      ctx.fillText(eventData.college, width / 2, 125);

      ctx.fillStyle = "#4A3728";
      ctx.font = "600 18px 'Inter', sans-serif";
      ctx.fillText(eventData.department, width / 2, 160);

      // Gold divider
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 140, 185);
      ctx.lineTo(width / 2 + 140, 185);
      ctx.stroke();

      // 4. Main Event Title
      ctx.fillStyle = "#6B1D2F";
      ctx.font = "bold 38px 'Cinzel', serif, Georgia";
      ctx.fillText("TEACHER'S DAY 2026", width / 2, 240);

      ctx.fillStyle = "#B27F2E";
      ctx.font = "italic 20px 'Cinzel', serif, Georgia";
      ctx.fillText("Personalized 3D Invitation QR Pass", width / 2, 275);

      // 5. Recipient Box
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#E8C77E";
      ctx.lineWidth = 1.5;
      const boxY = 310;
      const boxHeight = 110;
      ctx.beginPath();
      ctx.roundRect(80, boxY, width - 160, boxHeight, 16);
      ctx.fill();
      ctx.stroke();

      if (person.isVip) {
        ctx.fillStyle = "#8C6222";
        ctx.font = "bold 13px 'Inter', sans-serif";
        ctx.fillText("★ VIP DIGNITARY INVITATION ★", width / 2, boxY + 28);
      } else {
        ctx.fillStyle = "#8C6222";
        ctx.font = "bold 13px 'Inter', sans-serif";
        ctx.fillText("DEPARTMENT OF COMPUTER ENGINEERING", width / 2, boxY + 28);
      }

      ctx.fillStyle = "#6B1D2F";
      ctx.font = "bold 28px 'Cinzel', serif, Georgia";
      ctx.fillText(person.name, width / 2, boxY + 65);

      ctx.fillStyle = "#4A3728";
      ctx.font = "500 16px 'Inter', sans-serif";
      ctx.fillText(person.designation, width / 2, boxY + 92);

      // 6. QR Code Image in Center
      if (qrDataUrl) {
        const qrImg = new window.Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
          qrImg.src = qrDataUrl;
        });

        const qrSize = 340;
        const qrX = (width - qrSize) / 2;
        const qrY = 445;

        // QR frame
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#B27F2E";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 20);
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      // 7. Instructions below QR
      ctx.fillStyle = "#6B1D2F";
      ctx.font = "bold 19px 'Cinzel', serif, Georgia";
      ctx.fillText("📱 Scan with Camera to Open 3D Envelope Invitation", width / 2, 835);

      // 8. Event Date, Time, Venue Box
      ctx.fillStyle = "#FDF6EA";
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(100, 865, width - 200, 95, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#4A3728";
      ctx.font = "bold 15px 'Inter', sans-serif";
      ctx.fillText(`📅 ${eventData.date}   •   ⏰ ${eventData.time}`, width / 2, 902);

      ctx.fillStyle = "#6B1D2F";
      ctx.font = "600 15px 'Inter', sans-serif";
      ctx.fillText(`📍 ${eventData.venue}, Pune`, width / 2, 935);

      // 9. Footer Sanskrit Verse & Host
      ctx.fillStyle = "#8C6222";
      ctx.font = "bold 16px 'Cinzel', serif, Georgia";
      ctx.fillText("गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः", width / 2, 1005);

      ctx.fillStyle = "#8C6222";
      ctx.font = "500 13px 'Inter', sans-serif";
      ctx.fillText(`Presented with gratitude by ${person.isVip ? "Dr. M. N. Jadhav (HOD)" : "Team Aces"} • 2026`, width / 2, 1040);

      // Trigger download
      const dataUri = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUri;
      const cleanName = person.name.replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `Teachers_Day_Invite_QR_${cleanName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error generating full card PNG:", e);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF8] via-[#FDF6EA] to-[#F7EBD4] rounded-3xl p-6 sm:p-8 border-2 border-gold shadow-2xl space-y-5 my-8 print:shadow-none print:border-none print:p-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full bg-sand/60 hover:bg-sand text-ink-soft hover:text-maroon border border-gold/30 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2">
          {/* Dual Logos */}
          <div className="flex items-center justify-center gap-4 pb-1">
            <div className="relative w-10 h-10 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-xs flex items-center justify-center">
              <Image
                src="/logos/tssm-logo-clean.png"
                alt="TSSM Logo"
                width={36}
                height={36}
                className="object-contain max-h-[32px] w-auto"
              />
            </div>
            <div className="w-[1px] h-6 bg-gold/30" />
            <div className="relative w-10 h-10 rounded-full p-1 bg-gradient-to-br from-sand via-ivory to-sand/80 border border-gold/40 shadow-xs flex items-center justify-center">
              <Image
                src="/logos/aces-logo-clean.png"
                alt="ACES Logo"
                width={36}
                height={36}
                className="object-contain max-h-[32px] w-auto"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-light/30 border border-gold/40 text-gold-deep text-[11px] font-bold uppercase tracking-wider">
            <QrIcon className="w-3.5 h-3.5" />
            <span>{person.isVip ? "VIP QR Invitation Pass" : "Personalized Invitation QR"}</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-maroon">
            {person.name}
          </h2>
          <p className="text-xs text-ink-soft font-semibold">{person.designation}</p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-white rounded-2xl border-2 border-gold shadow-md relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${person.name}`}
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-sand/30 rounded-lg">
                <span className="text-xs text-ink-soft animate-pulse">Generating QR Code...</span>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-maroon flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
              <span>Scan using phone camera to open 3D invite</span>
            </p>
            <p className="text-[11px] text-ink-light font-mono break-all max-w-[340px] px-2 truncate">
              {fullUrl}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 print:hidden">
          {/* Main Download Button */}
          <button
            type="button"
            onClick={handleDownloadFullCard}
            disabled={isGeneratingCard}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-maroon via-[#8B2338] to-maroon text-paper font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 border border-gold/40 hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingCard ? "Generating Card..." : "Download Full Invitation Card (PNG)"}</span>
          </button>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleDownloadQrOnly}
              className="py-2 px-2.5 rounded-lg bg-sand/70 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1.5 border border-gold/40 transition"
              title="Download QR code only"
            >
              <QrIcon className="w-3.5 h-3.5 text-gold-deep" />
              <span>QR Only</span>
            </button>

            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-300 transition"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2 px-2.5 rounded-lg bg-sand/70 hover:bg-sand text-xs font-semibold text-ink flex items-center justify-center gap-1.5 border border-gold/40 transition"
            >
              {copied ? (
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
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-maroon text-xs font-semibold flex items-center justify-center gap-1.5 border border-gold/40 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </a>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="text-center pt-2 border-t border-gold/30 text-[11px] text-ink-soft">
          <p>
            📅 {eventData.date} &bull; ⏰ {eventData.time} &bull; 📍 {eventData.venue}
          </p>
        </div>
      </div>
    </div>
  );
}
