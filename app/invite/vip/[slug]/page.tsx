import { Metadata } from "next";
import Link from "next/link";
import VipInviteView from "@/components/VipInviteView";
import vipData from "@/data/vip.json";
import eventData from "@/data/event.json";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return vipData.map((v) => ({
    slug: v.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const vip = vipData.find((v) => v.slug === params.slug);

  if (!vip) {
    return {
      title: "VIP Invitation Not Found — Teacher's Day 2026",
    };
  }

  return {
    title: `Special Teacher's Day Invitation for ${vip.name} — HOD Dr. M. N. Jadhav`,
    description: `A personal Teacher's Day 2026 invitation for ${vip.name} (${vip.designation}) from Dr. M. N. Jadhav, HOD — Department of Computer Engineering, BSCOER Pune.`,
    openGraph: {
      title: `Teacher's Day Invitation for ${vip.name}`,
      description: `A personal invitation from Dr. M. N. Jadhav, HOD — Department of Computer Engineering.`,
      images: vip.photo ? [{ url: vip.photo }] : [],
    },
  };
}

export default function VipSlugPage({ params }: PageProps) {
  const vip = vipData.find((v) => v.slug === params.slug);

  if (!vip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-paper border border-gold/40 shadow-card-warm space-y-4">
          <span className="text-4xl block">💌</span>
          <h1 className="font-serif font-bold text-2xl text-maroon">
            VIP Invitation Not Found
          </h1>
          <p className="text-sm text-ink-soft">
            We couldn&rsquo;t find a VIP invitation link for{" "}
            <span className="font-mono text-xs bg-sand/60 px-2 py-1 rounded">
              {params.slug}
            </span>
            . Please check the link or return to the main faculty directory.
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

  return <VipInviteView vip={vip} event={eventData} />;
}
