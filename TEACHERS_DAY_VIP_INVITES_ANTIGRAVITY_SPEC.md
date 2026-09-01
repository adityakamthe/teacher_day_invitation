# Addendum: 3 VIP Invitations — Build Spec for Antigravity AI

This is a follow-up change on top of the existing Teachers' Day invitation
build (`TEACHERS_DAY_INVITE_ANTIGRAVITY_SPEC.md`). Reuse all existing
infrastructure — the 3D envelope, background scene, sound rig, stage
machine, design tokens — this is a **new content tier**, not a new app.

## 1. What's changing
Add 3 special, higher-touch invitations, distinct from the 24 standard
faculty/staff ones already built:

1. **Dr. S. R. Thite** (Campus Director)
2. **Mr. Vikas Jadhav**
3. **Dr. S. S. Deshmukh** (Principal)

Two things are different for these three, and only these three:
- **Sender**: these come personally from **Dr. M. N. Jadhav, HOD —
  Department of Computer Engineering** — not from "Team Aces."
- **Message**: each gets its own distinct, cheerful, eye-catching message
  (not the shared team message used for the other 24).

Everything else — envelope animation, background, sound, overall page
structure — stays the same visual family so it's recognizably "the same
invitation," just elevated and personalized for these three.

## 2. Data
These 3 people are **not** in `Faculty_Details.xlsx` — don't try to match
them against that sheet. Add a new small data file, `data/vip.json`:

```json
[
  {
    "slug": "director",
    "name": "The Director",
    "designation": "Director",
    "photo": null,
    "sender": "Dr. M. N. Jadhav, HOD — Department of Computer Engineering",
    "message": "<see §4>"
  },
  {
    "slug": "vikas-jadhav",
    "name": "Prof. Vikas Jadhav",
    "designation": "Professor",
    "photo": null,
    "sender": "Dr. M. N. Jadhav, HOD — Department of Computer Engineering",
    "message": "<see §4>"
  },
  {
    "slug": "principal-deshmukh",
    "name": "Dr. S. S. Deshmukh",
    "designation": "Principal",
    "photo": null,
    "sender": "Dr. M. N. Jadhav, HOD — Department of Computer Engineering",
    "message": "<see §4>"
  }
]
```
`photo: null` — no photos were supplied for these three. Use the existing
initials-badge fallback (already built for the standard 24) unless Aditya
supplies real photos later; don't fabricate or stock-photo a face in.

## 3. Routing
Give these their own namespace so they're clearly a distinct, more formal
tier rather than getting lost among the 24:
```
/invite/vip/director
/invite/vip/vikas-jadhav
/invite/vip/principal-deshmukh
```
Statically pre-render all 3 the same way as the standard set
(`generateStaticParams` reading `vip.json`).

## 4. Message content (placeholder drafts — Aditya can hand-edit later)
Cheerful, warm, a little more ceremonial than the general staff message
since these are addressed individually by the HOD. Each is short (4–5
sentences), signed off by name.

**To the Director:**
> "Dear Sir/Ma'am, on this joyous Teachers' Day, the Department of
> Computer Engineering wishes to celebrate the vision and support you
> bring to our institution every single day. Your guidance shapes not
> just our department, but the future of every student who walks through
> these halls. We're so grateful to have you leading the way. Wishing you
> a Teachers' Day filled with warmth and well-deserved appreciation!
> — With respect and gratitude, Dr. M. N. Jadhav, HOD, Department of
> Computer Engineering"

**To Prof. Vikas Jadhav:**
> "Dear Prof. Vikas Sir, Happy Teachers' Day! Your energy, dedication, and
> the way you connect with students make our department a livelier and
> better place. Thank you for every lecture, every bit of guidance, and
> every moment of encouragement you've given so generously. Here's to
> celebrating YOU today! — Warmly, Dr. M. N. Jadhav, HOD, Department of
> Computer Engineering"

**To the Principal, Dr. S. S. Deshmukh:**
> "Respected Dr. Deshmukh Sir, on behalf of the Department of Computer
> Engineering, a very Happy Teachers' Day to you! Your leadership and
> unwavering support have been the backbone of our department's growth
> and every milestone we've achieved. We deeply appreciate the trust and
> encouragement you continue to give us. Wishing you a day as inspiring
> as the leadership you provide! — With heartfelt regards, Dr. M. N.
> Jadhav, HOD, Department of Computer Engineering"

Keep these editable in `vip.json`, not hardcoded in components — Aditya
will likely want to hand-polish the exact wording before sending.

## 5. Visual treatment — make these feel special
Reuse the same envelope/card/sound system, but dial up the ceremony a
notch so these three don't feel identical to the mass batch:
- Slightly richer gold-foil detailing on the envelope and card border
  (heavier corner ornament, e.g. a double flourish instead of single).
- The "From" line on the envelope/card explicitly reads **"Dr. M. N.
  Jadhav, HOD — Department of Computer Engineering"** instead of "Team
  Aces" — this should be a data-driven field (`sender` in `vip.json`), not
  a hardcoded string, so it's easy to reuse this VIP pattern again later
  for other senders.
- Optional but nice: a small "Especially for you" or "A personal note
  from the HOD" tag on the card before the message reveals, to signal
  this isn't part of the general mailer. `(assumption — cosmetic, safe to
  skip if it complicates the component)`

## 6. Definition of done (for this addendum)
- [ ] `/invite/vip/director`, `/invite/vip/vikas-jadhav`, and
      `/invite/vip/principal-deshmukh` all render correctly.
- [ ] Each shows its own distinct message, signed from Dr. M. N. Jadhav,
      HOD — not the shared Aces team message.
- [ ] No broken photo — initials fallback displays cleanly for all 3.
- [ ] Visual family still matches the rest of the invitation site (same
      envelope/animation/sound), just with the elevated touches in §5.
- [ ] Existing 24 standard invitations are unaffected by this change.
