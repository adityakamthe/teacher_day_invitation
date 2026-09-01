import { Metadata } from "next";
import Link from "next/link";
import TeacherInviteView from "@/components/TeacherInviteView";
import facultyData from "@/data/faculty.json";
import eventData from "@/data/event.json";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return facultyData.map((f) => ({
    slug: f.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const faculty = facultyData.find((f) => f.slug === params.slug);

  if (!faculty) {
    return {
      title: "Invitation Not Found — Teacher's Day 2026",
    };
  }

  return {
    title: `Teacher's Day Invitation for ${faculty.name} — Team Aces`,
    description: `A personal Teacher's Day 2026 invitation for ${faculty.name} (${faculty.designation}) from Team Aces, Department of Computer Engineering.`,
    openGraph: {
      title: `Teacher's Day Invitation for ${faculty.name}`,
      description: `A warm and heartfelt personal invitation from Team Aces.`,
      images: faculty.photo ? [{ url: faculty.photo }] : [],
    },
  };
}

export default function InviteSlugPage({ params }: PageProps) {
  const faculty = facultyData.find((f) => f.slug === params.slug);

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-paper border border-gold/40 shadow-card-warm space-y-4">
          <span className="text-4xl block">💌</span>
          <h1 className="font-serif font-bold text-2xl text-maroon">
            Invitation Not Found
          </h1>
          <p className="text-sm text-ink-soft">
            We couldn&rsquo;t find an invitation link for <span className="font-mono text-xs bg-sand/60 px-2 py-1 rounded">{params.slug}</span>. Please check the link or view the faculty directory.
          </p>
          <Link
            href="/invite"
            className="inline-block py-2.5 px-6 rounded-full bg-gold text-paper font-semibold text-sm shadow hover:bg-gold-deep transition"
          >
            View All Invitations &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return <TeacherInviteView faculty={faculty} event={eventData} />;
}
