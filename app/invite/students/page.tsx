import { Metadata } from "next";
import StudentInviteView from "@/components/StudentInviteView";
import eventData from "@/data/event.json";

export const metadata: Metadata = {
  title: "Teacher's Day Invitation — All Computer Department Students",
  description:
    "Official Teacher's Day 2026 invitation for all SE, TE, and BE Computer Engineering students. Dress code: Pastel Colors! Organized by Team Aces.",
  openGraph: {
    title: "Teacher's Day 2026 — Student Invitation & Pastel Dress Code",
    description:
      "Join us to celebrate and honor our beloved teachers! Dress Code: Pastel Colors. Organized with love by Team Aces.",
  },
};

export default function StudentInvitePage() {
  return <StudentInviteView event={eventData} />;
}
