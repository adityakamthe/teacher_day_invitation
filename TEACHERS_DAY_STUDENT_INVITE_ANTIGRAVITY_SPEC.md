# Addendum: Student Invitation Card (with Pastel Dress Code) — Build Spec for Antigravity AI

This is a follow-up addition to the existing Teachers' Day invitation
build. Reuse the same envelope/animation/sound system and warm-classic
design tokens already established — this is a **new, general-audience
invitation variant**, not a personalized one like the faculty/VIP cards.

## 1. What's different about this one
The 24 faculty/staff invites and the 3 VIP invites are each addressed to
one named individual. This new card is for **all Computer Department
students** — one shared invitation, not 24+ personalized copies.
`(assumption: single shared page rather than per-student links, since no
student list/roster was provided — flag to Aditya if individual
per-student links are actually wanted)`

- **Recipient**: "Dear Computer Department Students" (general greeting,
  not name-personalized).
- **Sender**: Team Aces `(assumption — same organizing team as the
  general faculty mailer; change if this should also come from the HOD)`.
- **Purpose**: this is an *event invitation with instructions*, not just a
  warm greeting — it needs to clearly communicate the event and, notably,
  the dress code.
- **Route**: a single page, e.g. `/invite/students` — no dynamic slug
  needed.

## 2. Content
Reuse `data/event.json` (eventName, date, time, venue, department) for the
shared event details. Add one new field:
```json
{
  "dressCode": "Pastel Colors",
  "dressCodeNote": "Come dressed in your favourite soft pastel shades — pinks, mints, lavenders, baby blues, and peaches — and let's make the celebration as colorful as our gratitude!"
}
```
Keep the wording editable — the note above is a placeholder draft, cheerful
in tone to match the rest of the messaging.

Card copy structure:
1. Warm greeting to students from Team Aces.
2. A short, cheerful line about celebrating the department's teachers
   together.
3. Event details block: date, time, venue (same placeholders as the main
   spec until Aditya fills them in).
4. **A clearly highlighted "Dress Code" section** — see §3, this should be
   the most visually distinct element on the card, not a buried line of
   text.

## 3. Dress code section — design treatment
Since "pastel dress code" is the specific new ask, give it real visual
presence rather than treating it as another line of body text:
- A dedicated card/banner within the invitation, separate from the general
  paragraph text.
- Display a small row of pastel color swatches as a visual motif — soft
  pink `#F8D7DA`, mint `#D5F0E3`, lavender `#E6D9F5`, baby blue `#D6EAF8`,
  peach `#FDEBD0` — as simple rounded swatch chips or a soft gradient
  strip, purely decorative (not clickable/functional).
- Heading treatment: something like "✨ Dress Code: Pastel Please! ✨" in
  the existing serif display font, sized to stand out from body copy.
- Keep the swatches themselves pastel, but don't change the invitation's
  own warm-gold/ivory brand palette elsewhere on the card — the pastel
  strip should read as a highlighted callout embedded in the existing
  warm-classic design, not a full re-theme of the card.

## 4. Everything else — reuse, don't rebuild
- Same 3D envelope open → card reveal flow as the existing build.
- Same background scene and ambient sound (post audio-fix).
- Same fonts (Cormorant Garamond / Mukta) and base palette.
- Same reduced-motion / mobile handling.

## 5. Definition of done
- [ ] `/invite/students` renders a single, general (non-personalized)
      invitation addressed to Computer Department students.
- [ ] Event details (date/time/venue) pull from the shared `event.json`,
      same as the rest of the site.
- [ ] Dress code section is visually distinct and immediately noticeable
      — not just another paragraph — and clearly states "pastel colors."
- [ ] Visual family (envelope, animation, sound, fonts, core palette)
      matches the rest of the invitation site.
- [ ] Doesn't interfere with or duplicate the existing 24 faculty routes
      or the 3 VIP routes.
