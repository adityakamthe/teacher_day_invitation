import type { Metadata } from "next";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://teachersday.bscoer.in"),
  title: "Teacher's Day 2026 — An Invitation from Team Aces",
  description: "A warm and heartfelt personal Teacher's Day 3D invitation from Team Aces (Department of Computer Engineering, BSCOER Pune).",
  keywords: ["Teacher's Day", "BSCOER", "Team Aces", "Invitation", "Computer Engineering"],
  openGraph: {
    title: "Teacher's Day 2026 — Special Invitation",
    description: "You are cordially invited to celebrate Teacher's Day with Team Aces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${mukta.variable}`}>
      <body className="antialiased selection:bg-gold-light/40 selection:text-maroon">
        {children}
      </body>
    </html>
  );
}
