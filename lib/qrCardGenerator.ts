import QRCode from "qrcode";
import eventData from "@/data/event.json";

export interface QrItem {
  slug: string;
  name: string;
  designation: string;
  isVip?: boolean;
  category?: string;
  id?: number;
}

export async function generateQrCardBlob(item: QrItem, origin: string): Promise<Blob> {
  const inviteUrl = item.slug === "students"
    ? `${origin}/invite/students`
    : item.isVip
    ? `${origin}/invite/vip/${item.slug}`
    : `${origin}/invite/${item.slug}`;

  // 1. Generate QR Data URL
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    width: 400,
    margin: 1.5,
    color: {
      dark: "#6B1D2F",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "H",
  });

  // 2. Render to Canvas
  const width = 800;
  const height = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#FFFDF8");
  grad.addColorStop(0.5, "#FDF6EA");
  grad.addColorStop(1, "#F7EBD4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Borders
  ctx.strokeStyle = "#B27F2E";
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.strokeStyle = "#6B1D2F";
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, width - 68, height - 68);

  // Header
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

  // Divider
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 185);
  ctx.lineTo(width / 2 + 140, 185);
  ctx.stroke();

  // Event Title
  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 38px 'Cinzel', serif, Georgia";
  ctx.fillText("TEACHER'S DAY 2026", width / 2, 240);

  ctx.fillStyle = "#B27F2E";
  ctx.font = "italic 20px 'Cinzel', serif, Georgia";
  ctx.fillText("Personalized 3D Invitation QR Pass", width / 2, 275);

  // Recipient Box
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#E8C77E";
  ctx.lineWidth = 1.5;
  const boxY = 310;
  const boxHeight = 110;
  ctx.beginPath();
  ctx.roundRect(80, boxY, width - 160, boxHeight, 16);
  ctx.fill();
  ctx.stroke();

  if (item.isVip) {
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
  ctx.fillText(item.name, width / 2, boxY + 65);

  ctx.fillStyle = "#4A3728";
  ctx.font = "500 16px 'Inter', sans-serif";
  ctx.fillText(item.designation, width / 2, boxY + 92);

  // QR Image
  const qrImg = new Image();
  qrImg.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    qrImg.onload = resolve;
    qrImg.onerror = reject;
    qrImg.src = qrDataUrl;
  });

  const qrSize = 340;
  const qrX = (width - qrSize) / 2;
  const qrY = 445;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#B27F2E";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 20);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Scan instruction
  ctx.fillStyle = "#6B1D2F";
  ctx.font = "bold 19px 'Cinzel', serif, Georgia";
  ctx.fillText("📱 Scan with Camera to Open 3D Envelope Invitation", width / 2, 835);

  // Event info box
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

  // Sanskrit Verse
  ctx.fillStyle = "#8C6222";
  ctx.font = "bold 16px 'Cinzel', serif, Georgia";
  ctx.fillText("गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः", width / 2, 1005);

  ctx.fillStyle = "#8C6222";
  ctx.font = "500 13px 'Inter', sans-serif";
  ctx.fillText(`Presented with gratitude by ${item.isVip ? "Dr. M. N. Jadhav (HOD)" : "Team Aces"} • 2026`, width / 2, 1040);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to convert canvas to blob"));
    }, "image/png");
  });
}
