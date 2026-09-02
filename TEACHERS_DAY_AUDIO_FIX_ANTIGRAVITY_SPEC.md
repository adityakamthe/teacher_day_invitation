# Addendum: Fix Background Sound — Build Spec for Antigravity AI

This is a follow-up fix on the existing Teachers' Day invitation build.
It replaces the ambient background sound only — the chime, envelope
animation, message content, and everything else from the earlier specs
stays as-is.

## 1. The problem
The current "background sound" is not a real ambient loop — it's a
`Tone.PolySynth` (triangle oscillator) firing one long chord
(`pad.triggerAttackRelease(["C3","G3","E4"], "6m", ...)`) through a
`Tone.Reverb`, with **no compressor/limiter** on the signal chain. Stacked
synthesized triangle-wave voices through a wet reverb with nothing
limiting the output is what's producing the harsh, crackly/distorted
sound — and because it's a single triggered note rather than a loop, the
sound also just dies out instead of continuing under the experience.

## 2. The fix — replace the synth pad with a real audio file
Don't try to tune the existing synth further. Swap it for an actual
pre-recorded ambient audio track, loaded once and looped cleanly. This is
far more reliable than trying to make a synthesized pad sound clean.

### 2.1 Audio asset
- Add a short (30–90 second, seamlessly loopable) warm, soft instrumental
  ambient track to `public/audio/ambient-loop.mp3`. Tone should match the
  "warm classic" visual direction — think a gentle sitar/flute drone,
  soft strings, or a warm harmonium pad. Nothing percussive or busy — it
  needs to sit quietly under the visuals without competing with it.
  `(Aditya: source this yourself from a royalty-free library — e.g.
  Pixabay Music, Free Music Archive, or a personal recording — and drop
  the file into `public/audio/`; Antigravity should wire up playback, not
  fabricate audio content.)`
- Keep the existing bell/chime-on-open sound (`bell` PolySynth) — that
  part isn't reported as broken. Only the sustained background pad is
  being replaced.

### 2.2 Playback implementation
Replace the `pad` synth with a `Tone.Player` (or a plain `<audio>` element
if simpler) that:
- Loads `/audio/ambient-loop.mp3`, `loop = true`.
- Starts playing (fading in over ~1.5s to avoid a hard start-click) once
  the envelope reaches the `settled` stage — same trigger point as today.
- Runs through a **`Tone.Limiter`** (e.g. ceiling around -1dB) before
  `toDestination()`, as a safety net against any future clipping —
  cheap insurance even with a clean source file.
- Sits at a quiet level (roughly -20 to -24dB, matching where the old pad
  was aimed, but actually audible now instead of decaying to silence).
- Responds to the existing mute toggle exactly as before
  (`Tone.Destination.mute` or pausing the player — either is fine as long
  as the existing mute button keeps working).
- Fades out (don't hard-cut) if the user mutes or navigates away, to
  avoid a click at the end too.

### 2.3 What to keep from the old code
- `ensureAudio()` gating audio start behind the user's open-tap gesture —
  keep this exactly as-is (needed for autoplay policies anyway).
- The `bell` chime-on-open — untouched.
- The mute toggle UI/behavior — untouched, just re-wired to control the
  new player instead of the old pad synth.

## 3. Definition of done
- [ ] No more crackle/distortion — background sound is smooth and clean
      on both a laptop and a phone speaker.
- [ ] Background sound actually sustains as a loop through the
      `settled`/message stages, instead of decaying to silence after a
      few seconds.
- [ ] Mute toggle still works and now also stops the looped track (not
      just the old pad).
- [ ] Chime-on-open is unaffected.
- [ ] No audio plays before the user's first tap/click (autoplay-safe).
