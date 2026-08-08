import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestByToken } from "@/lib/guests";
import { Cover } from "@/components/invitation/cover";
import { Hero } from "@/components/invitation/hero";
import { Couple } from "@/components/invitation/couple";
import { Countdown } from "@/components/invitation/countdown";
import { Story } from "@/components/invitation/story";
import { InviteStatement } from "@/components/invitation/invite-statement";
import { Details } from "@/components/invitation/details";
import { MeetSection } from "@/components/invitation/meet-section";
import { DressCode } from "@/components/invitation/dress-code";
import { Gallery } from "@/components/invitation/gallery";
import { Gifts } from "@/components/invitation/gifts";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { Closing } from "@/components/invitation/closing";

// Cada invitación es personalizada → no cachear estáticamente
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invitación · Boda A&A",
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);

  if (!guest) notFound();

  return (
    <main className="bg-twilight-deep">
      <Cover />
      <Hero />
      <Couple />
      <Countdown />
      <Story />
      <InviteStatement />
      <Details />
      <MeetSection />
      <DressCode />
      <Gallery />
      <Gifts />
      <RsvpForm guest={guest} />
      <Closing token={token} />
    </main>
  );
}
