const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const facultyData = require("../data/faculty.json");
const vipData = require("../data/vip.json");
const eventData = require("../data/event.json");

const OUTPUT_DIR = path.join(__dirname, "../public/qr-codes");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// In production / local dev, base URL fallback
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://teachers-day-invite.vercel.app";

async function generateQRCodes() {
  console.log("Generating QR codes for Teacher's Day Invitations...");
  
  const manifest = {
    generatedAt: new Date().toISOString(),
    event: eventData.eventName,
    baseUrl: BASE_URL,
    vips: [],
    faculty: [],
  };

  // 1. VIP QR Codes
  for (const vip of vipData) {
    const inviteUrl = `${BASE_URL}/invite/vip/${vip.slug}`;
    const filename = `vip_${vip.slug}.png`;
    const filePath = path.join(OUTPUT_DIR, filename);

    await QRCode.toFile(filePath, inviteUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: "#6B1D2F", // Royal Maroon
        light: "#FFFDF8", // Ivory Sand
      },
      errorCorrectionLevel: "H",
    });

    manifest.vips.push({
      slug: vip.slug,
      name: vip.name,
      designation: vip.designation,
      url: inviteUrl,
      qrImage: `/qr-codes/${filename}`,
    });
    console.log(`✓ VIP QR created: ${vip.name} -> ${filename}`);
  }

  // 2. Faculty & Staff QR Codes
  for (const f of facultyData) {
    const inviteUrl = `${BASE_URL}/invite/${f.slug}`;
    const filename = `faculty_${f.id.toString().padStart(2, "0")}_${f.slug}.png`;
    const filePath = path.join(OUTPUT_DIR, filename);

    await QRCode.toFile(filePath, inviteUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: "#6B1D2F", // Royal Maroon
        light: "#FFFDF8", // Ivory Sand
      },
      errorCorrectionLevel: "H",
    });

    manifest.faculty.push({
      id: f.id,
      slug: f.slug,
      name: f.name,
      designation: f.designation,
      category: f.category,
      url: inviteUrl,
      qrImage: `/qr-codes/${filename}`,
    });
    console.log(`✓ Faculty QR created: [${f.id}] ${f.name} -> ${filename}`);
  }

  // Save manifest index
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  console.log(`\n🎉 Successfully generated ${manifest.vips.length} VIP QR codes and ${manifest.faculty.length} Faculty QR codes in public/qr-codes/!`);
}

generateQRCodes().catch((err) => {
  console.error("Error generating QR codes:", err);
  process.exit(1);
});
