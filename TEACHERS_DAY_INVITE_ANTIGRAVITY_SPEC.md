# Teachers' Day 3D Invitation — Build Spec for Antigravity AI

## 0. What this document is
This is a build brief for an AI coding agent (Antigravity). It describes a
finished product, the data that already exists, the design language to
follow, and the acceptance criteria. Build the whole thing — don't stop to
ask for missing pieces that are already specified below; where a genuine
creative decision is left open, a sensible default is stated and marked
`(assumption)`.

Reference files that ship alongside this spec:
- `TeachersDayInvite.jsx` — existing warm/classic single-teacher prototype.
  Use its color system, envelope stage-machine (`closed → opening →
  emerging → settled`), and Tone.js sound rig as the **starting point** —
  don't throw it away, upgrade it.
- `TeachersDayInvite__1_.jsx` — a discarded purple/night color exploration.
  Ignore its palette; it is not the "warm classic" direction we want.
- `Faculty_Details.xlsx` — source of truth for who gets an invitation.

## 1. Project summary
Build a personalized, animated Teachers' Day e-invitation web app from the
Aces team (a student group at BSCOER, Pune) to 24 named faculty and staff.
Each recipient gets their own shareable link. Opening the link plays a
short cinematic sequence — an animated 3D envelope opening against a warm
festive background — which then reveals a main invitation card addressed
to them by name, followed by a warm personal message from the Aces team,
with soft ambient sound throughout. The whole thing is a single Next.js
app deployed on Vercel.

## 2. Recipients (from Faculty_Details.xlsx)
24 people total: 18 teaching faculty (Department of Computer Engineering)
+ 6 technical assistants. Each has a name, a designation, and a photo
embedded in the spreadsheet.

| # | Name | Designation |
|---|------|-------------|
| 1 | Dr. Madhuri N. Jadhav | Assistant Professor |
| 2 | Prof. Anil D. Gujar | Assistant Professor |
| 3 | Dr. Deepa A. Padalkar | Assistant Professor |
| 4 | Prof. Puja R. Patil | Assistant Professor |
| 5 | Prof. Shubhangi S. Bhagat | Assistant Professor |
| 6 | Prof. Arti D. Dhumal | Assistant Professor |
| 7 | Prof. Nikita G. Khandare | Assistant Professor |
| 8 | Prof. Pooja R. Raut | Assistant Professor |
| 9 | Prof. Varsharani R. Yedage | Assistant Professor |
| 10 | Prof. Anuja M. Yelve | Assistant Professor |
| 11 | Prof. Sneha P. Dhule | Assistant Professor |
| 12 | Prof. Shital N. Kalpande | Assistant Professor |
| 13 | Prof. Ajay T. Aiwale | Assistant Professor |
| 14 | Prof. Parveen Kumari | Assistant Professor *(blank in sheet — assumption)* |
| 15 | Prof. Soujanya Bhavimani | Assistant Professor *(blank in sheet — assumption)* |
| 16 | Prof. Kamal Shippurkar | Assistant Professor |
| 17 | Prof. Aarti Bobade | Assistant Professor *(blank in sheet — assumption)* |
| 18 | Prof. Priya D. Bhole | Assistant Professor |
| 19 | Mr. Shrinivas Vairagal | Technical Assistant |
| 20 | Mrs. Pooja Durgade | Technical Assistant |
| 21 | Ms. Priyanka Pawar | Technical Assistant |
| 22 | Ms. Tejal Gangane | Technical Assistant |
| 23 | Mr. Virbhadra Nila | Technical Assistant |
| 24 | Ms. Rohini K. Dubal | Technical Assistant |

Photos are embedded images inside `Faculty_Details.xlsx` (sheet "Faculty
Nameplates"), one per row, 24 total — not separate image files.

### 2.1 Data extraction step (do this first)
Write a one-off Python script (`scripts/extract_faculty.py`, run once
locally / in CI, not at runtime) that:
1. Opens `Faculty_Details.xlsx` with `openpyxl`.
2. Reads rows from the "Faculty Nameplates" sheet, pulling Name and
   Designation per row, and matches each row to its anchored embedded
   image (`ws._images`, matched by anchor row).
3. Saves each photo to `public/faculty/<slug>.jpg` (resize/compress to a
   reasonable web size, e.g. max 800px on the long edge).
4. Generates `data/faculty.json`, an array of:
   ```json
   {
     "slug": "madhuri-jadhav",
     "name": "Dr. Madhuri N. Jadhav",
     "designation": "Assistant Professor",
     "photo": "/faculty/madhuri-jadhav.jpg"
   }
   ```
   `slug` = lowercased, hyphenated name with titles (Dr./Prof./Mr./Mrs./Ms.)
   stripped, safe for URLs.
5. Print a summary (24 in, 24 out) and flag any row that didn't get an
   image matched, so a human can fix it before launch rather than shipping
   a broken card.

If any photo turns out to be missing or low quality, fall back to a soft
initials badge (the existing `initialsOf()` helper in
`TeachersDayInvite.jsx` already does this) rather than blocking the build.

## 3. Design direction — "warm classic"
Base the palette, type, and mood on `TeachersDayInvite.jsx` (the
ivory/gold/maroon version), not the purple one. Elevate it rather than
redesign it from scratch:

- **Palette**: ivory `#FBF3E4`, sand `#F3E1BE`, paper `#FFFCF4`, gold
  `#B27F2E`, gold-light `#E8C77E`, gold-deep `#8C6222`, maroon `#7A2A2E`,
  ink `#3D2B1E`, flame accents `#FF9142` / `#FFD98A`.
- **Type**: Cormorant Garamond (serif, italic for flourish text) for
  headings/names, Mukta (sans) for body copy — both already imported.
- **Mood**: classic Indian festive stationery — gold foil linework, warm
  candlelight glow, soft floating marigold/petal particles, wax-seal
  motifs. Not neon, not corporate, not the cold purple version.
- **Motion character**: gentle, warm, unhurried — think candle flicker and
  paper settling, not snappy UI motion.

## 4. Experience flow (state machine)
Extend the existing `closed → opening → emerging → settled` pattern into:

1. **`closed`** — Landing view. Warm animated background (see §6) behind a
   3D envelope addressed "To, `<Recipient Name>`" with a wax seal. Envelope
   idly bobs/breathes. Tapping/clicking it (or the seal) starts the sequence
   and unlocks audio (`Tone.start()` must happen on this user gesture).
2. **`opening`** — Wax seal cracks and lifts; envelope flap folds open in
   3D (rotateX with real perspective, not just opacity) with a light burst
   from inside; a soft chime plays (already built — reuse `playOpenSound`).
3. **`emerging`** — The invitation card rises/unfolds out of the envelope
   with a subtle 3D tilt-in, card catches gold light as it settles.
4. **`settled`** — Main invitation card is fully visible: recipient's
   name, photo, designation, event details (date/time/venue — see §7),
   department heading. Background continues its soft ambient animation.
   Ambient background *music/pad* (not just the chime) loops quietly from
   here, muteable via the existing speaker-icon toggle (always visible,
   top corner).
5. **`message`** — A clearly-invited next step (e.g. a "Read our message
   for you 💌" button, or auto-reveal after a few seconds — `(assumption:
   button-triggered, so recipients control pacing)`) reveals a warm,
   personal message card from the Aces team. Keep this on the same page
   (scroll or crossfade), not a separate route, so the whole thing still
   feels like one continuous unwrapping.

Respect `prefers-reduced-motion` throughout (the existing code already
checks this — keep and extend that guard for every new animation).

## 5. The message from the Aces team
Placeholder copy Antigravity should use as a starting draft (Aditya can
edit the exact wording later) — warm, sincere, personal, addressed to the
individual by name, on behalf of "Team Aces." Keep it short (3–5 sentences):
thank them for their guidance, celebrate their impact on students, wish
them a happy Teachers' Day. Store this as editable content in the data
layer (§7), not hardcoded into a component, so it's a one-line copy change
later.

## 6. Background & 3D animation spec
Replace the current plain envelope with a genuinely 3D, layered scene:

- **Background**: warm gradient (ivory → sand → soft gold glow at center),
  with slow-drifting soft-focus bokeh lights and a handful of falling
  marigold-petal / gold-leaf particles (CSS/SVG based, reuse and extend the
  existing `PETALS` array pattern — just make it richer and give it real
  depth via layered parallax, not a flat overlay).
- **Envelope**: build with real CSS 3D (`transform-style: preserve-3d`,
  `perspective`) so the flap genuinely rotates in 3D space and the paper
  card can slide out from behind it, rather than crossfading between flat
  states. A subtle parallax tilt on mouse-move / device-tilt (mobile) that
  already exists (`handleMove`/`tilt`) should be kept and applied to the
  whole 3D scene, not just a 2D shadow.
- **Performance**: prefer CSS 3D transforms + Framer Motion over a full
  Three.js scene for the envelope — it's lighter, works well on the
  low-end Android phones this will mostly be viewed on, and matches the
  existing codebase. `(assumption — flag to Aditya if a heavier
  react-three-fiber scene is specifically wanted instead)`.
- **Card reveal**: the main card should feel like stiff, warm cardstock —
  slight drop shadow, subtle paper-grain texture, gold foil border/corner
  flourishes (the existing `Corner()` SVG ornament, reused at each
  corner).

## 7. Data & content layer
`data/faculty.json` (generated per §2.1) plus a small `data/event.json`
for shared, non-per-person content:
```json
{
  "eventName": "Teachers' Day Celebration",
  "date": "5 September 2026",
  "time": "TBD",
  "venue": "TBD",
  "department": "Department of Computer Engineering",
  "hostedBy": "Team Aces",
  "message": "<the warm message text from §5>"
}
```
Leave `time`/`venue` as clearly-marked placeholders in the UI (not
fabricated specifics) until Aditya fills them in.

## 8. Tech stack
- **Next.js 14 (App Router)** + **TypeScript**
- **Tailwind CSS** for layout/utility styling, custom CSS (or Tailwind
  theme extension) for the warm-classic design tokens in §3
- **Framer Motion** for the stage-machine choreography and 3D transforms
- **Tone.js** — reuse the existing chime/pad synth rig as-is
- Deployment target: **Vercel**

## 9. Routing & personalization
Each recipient gets a clean, shareable URL:
```
/invite/[slug]         e.g. /invite/madhuri-jadhav
```
`app/invite/[slug]/page.tsx` looks up the slug in `faculty.json` at build
time (`generateStaticParams`) and statically pre-renders all 24 pages —
fast, free, and no runtime lookup needed. If a slug isn't found, show a
friendly "invitation not found" state, not a raw 404.

Keep the legacy `?teacher=` query-param behavior out of scope for the new
build — the new per-person routes fully replace it. `(assumption)`

Also build a simple **internal index page** (`/invite`, not linked from
recipient-facing pages, or password-light e.g. `/admin`) that lists all 24
names with their generated links, so the Aces team can copy-paste the
right link per person without digging through code. `(assumption — a
convenience page, drop it if unwanted)`

## 10. Sound design
- Keep the existing Tone.js-based chime-on-open.
- Add a soft looping ambient pad/bell texture that starts once the card is
  `settled` and continues (quietly) through the message reveal — "sweet
  background sound" per the brief. Keep volume low (~ -20 to -24dB per the
  existing pad levels) so it's felt, not intrusive.
- Audio must only start after a user gesture (tap/click) — never autoplay
  before interaction, both for UX and because most browsers block it
  anyway. The existing `ensureAudio()` gate already does this correctly —
  keep that pattern.
- Mute toggle stays visible and persistent across all stages.

## 11. Responsive & accessibility
- Mobile-first — most recipients will open this on a phone via WhatsApp.
- Respect `prefers-reduced-motion` (already partially handled — extend to
  all new animations, with instant/near-instant fallback transitions).
- Sufficient color contrast for text over the warm background (check
  ink-on-ivory ratios, especially over the animated background layer).
- Keyboard-operable open action (the existing envelope button already
  handles `:focus-visible`).

## 12. File structure (suggested)
```
/app
  /invite/[slug]/page.tsx
  layout.tsx
/components
  Envelope3D.tsx
  InvitationCard.tsx
  TeamMessage.tsx
  BackgroundScene.tsx
  SoundController.tsx
/data
  faculty.json
  event.json
/public
  /faculty/*.jpg
/scripts
  extract_faculty.py
```

## 13. Definition of done
- [ ] All 24 recipients have a working `/invite/<slug>` page with their
      correct name, designation, and photo (or initials fallback).
- [ ] Envelope opening feels genuinely 3D (real perspective/rotation, not
      a crossfade) and matches the warm-classic palette.
- [ ] Background is animated and warm/festive, replacing the current plain
      background.
- [ ] Main card → team message flows as one continuous experience.
- [ ] Ambient sound plays after the open gesture, loops softly, and is
      mute-toggleable at all times.
- [ ] Reduced-motion and mobile are both handled gracefully.
- [ ] `npm run build` succeeds and the app deploys cleanly to Vercel.
- [ ] An internal link list exists so the Aces team can distribute all 24
      links without touching code.

## 14. Explicit open items for Aditya (not blocking the build)
- Exact event date/time/venue — currently placeholders.
- Final wording of the team's message (placeholder direction given).
- Whether an internal "copy all links" admin page is wanted (built by
  default per §9 — easy to remove if not).
