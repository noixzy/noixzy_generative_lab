# NOIXZY_GENERATIVE_LAB — Unified Shell Checkpoint Handoff

Date: 2026-06-27
Project path: `/Users/noixzy.macbookpro/Downloads/noixzy_generative_lab`
Repo: `https://github.com/noixzy/noixzy_generative_lab.git`
Branch: `feature-hand-authored-preview-undo-redo`
Latest clean pushed commit: `6937d65 Fade unified shell badge edges`

## Current State

The repo was clean after the latest push.

Latest confirmed pushed commit:

`6937d65 Fade unified shell badge edges`

Branch tracking confirmed synced with:

`origin/feature-hand-authored-preview-undo-redo`

Current active polish target:

`unified_shell.html`

This is ChatGPT Desktop, not Codex, Claude, or VS Code. Do not assume direct repo access unless the user pastes output or asks for exact commands.

## Recent Unified Shell Commit Stack

Recent relevant commits:

- `7a8bb90 Tune unified shell badge and grid`
- `f3d4258 Tune unified shell CRT rail overlay`
- `470458b Add unified shell rail glow`
- `6937d65 Fade unified shell badge edges`

The unified shell visual pass is currently locked at `6937d65`.

## Major Work Completed

### 1. Unified Shell CRT Rail Overlay

The top rail in `unified_shell.html` now has a monochrome CRT/noir texture treatment.

Current design intent:

- Black/noir rail.
- White/gray CRT scanline feel.
- No color wash.
- No teal/yellow/green gradient.
- No obvious white rail border.
- No animated glint strip at the very top.
- CRT texture should sit over the thumbnail/header region.
- CRT should not hang visibly down into the canvas.
- CRT movement should feel alive but not chaotic.

The CRT layer should live on:

`.rail::after`

The noise animation should use:

`@keyframes noixzyRailCrtNoise`

Important cleanup already performed:

- Removed duplicate `.rail::after` blocks.
- Removed old animated rail glint.
- Removed old vertical CRT lines.
- Removed dead `shellRailHolo` keyframes.
- Removed dead `shellRailGlint` keyframes.
- Cleaned duplicate/broken `.rail::before` selector.

Avoid reintroducing:

- `shellRailGlint`
- `shellRailHolo`
- `repeating-linear-gradient(to right, ...)`

unless the user explicitly asks for those back.

### 2. Rail Glow / Bloom

Commit `470458b Add unified shell rail glow` added restrained monochrome glow/bloom to the top rail.

Relevant intent:

- Add subtle bloom.
- Keep it black/white/gray only.
- No colored glow.
- No neon wash.
- No module HTML files touched.

Current glow concept:

```css
.rail {
  box-shadow:
    0 0 18px rgba(255,255,255,.10),
    0 10px 28px rgba(255,255,255,.055),
    inset 0 -1px 0 rgba(255,255,255,.08);
}
```

Safe adjustment range:

- More glow: first alpha `.10` -> `.14`
- Less glow: first alpha `.10` -> `.06`

Thumbnail image glow was added through `.moduleButton img` with a restrained monochrome `drop-shadow`.

### 3. Center Badge / Logo

Badge selector:

`.logoOverlay`

Logo artwork selector:

`.logoOverlay img`

Very important distinction:

- `.logoOverlay` = badge box.
- `.logoOverlay img` = logo artwork.

When the user says “scale logo, not badge box,” edit only `.logoOverlay img`.

Do not casually edit `.logoOverlay` width, height, top, left, or position unless explicitly requested.

Current intent:

- Badge remains centered in rail.
- Badge core stays black behind the logo.
- Logo artwork can be scaled and moved inside the badge.
- Badge box should not scale unless explicitly requested.

Likely logo artwork transform target:

```css
.logoOverlay img {
  transform: translateY(-18px) scale(1.42);
  transform-origin: center;
}
```

Adjustment guide:

- Bigger logo: `scale(1.48)` or `scale(1.55)`
- Smaller logo: `scale(1.30)` or `scale(1.35)`
- Move logo up: `translateY(-20px)` or `translateY(-24px)`
- Move logo down: `translateY(-12px)` or `translateY(-8px)`

### 4. Badge Edge Fade

Commit `6937d65 Fade unified shell badge edges` added outward fade wings on the left and right edges of the badge.

User request:

“fade out the left and right edges of badge box but keep the inner part behind the logo black. Make the fade push outward, away from badge. Push fade like 15 px outward.”

Implementation concept:

```css
.logoOverlay {
  overflow: visible;
}
```

Fade wings:

`.logoOverlay::before`
`.logoOverlay::after`

Design intent:

- Center remains black.
- Fade does not cover or eat into logo.
- Fade extends outward away from badge.
- Fade is about `15px`.
- Left wing extends left with `right: 100%`.
- Right wing extends right with `left: 100%`.
- Logo image sits above fade wings with higher `z-index`.

Conceptual CSS:

```css
.logoOverlay::before,
.logoOverlay::after {
  content: "";
  position: absolute;
  top: 0;
  width: 15px;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.logoOverlay::before {
  right: 100%;
  background: linear-gradient(to left, #000 0%, rgba(0,0,0,0) 100%);
}

.logoOverlay::after {
  left: 100%;
  background: linear-gradient(to right, #000 0%, rgba(0,0,0,0) 100%);
}

.logoOverlay img {
  position: relative;
  z-index: 2;
}
```

## Parked Local Files

Two files were parked locally using `.git/info/exclude`.

They are intentionally not committed:

- `blender_builds/unified_shell_pilot_scene.blend`
- `workspace/ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`

They remain on disk but should not appear in `git status`.

Do not delete or commit them unless the user explicitly asks.

## Important Accident That Was Cleaned Up

A large dirty working tree appeared across approximately 50 files:

- `build_lab.js`
- almost every module HTML file
- `noixzy_lab_shell_v1.html`

It was a global old-module `.stageThumbs` rail redesign.

It added:

- `holoRailSweep`
- white glow borders
- changed old left module rail height
- changed thumb row sizing
- changed old blue accents to white

That batch was restored and not committed.

Do not reapply that old module rail redesign unless the user explicitly asks.

## Protected Files

Do nor touch unless explicitly requested:

- `build_lab.js`
- `gallery/index.html`
- `gallery/thumbs`
- `modules.manifest.json`
- all module HTML files
- `noixzy_lab_shell_v1.html`
- parked Blender/workspace files

For the next shell-polish tasks, the expected file scope is:

`unified_shell.html` only

Never use:

`git add .`

Use explicit adds only.

## Standard Verify Command

Run this at start of next chat:

```zsh
cd /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab && {
  echo "=== NGL UNIFIED SHELL CHECKPOINT VERIFY ==="
  date
  echo
  echo "=== STATUS ==="
  git status --short
  echo
  echo "=== LATEST COMMIT ==="
  git log -1 --oneline
  echo
  echo "=== BRANCH TRACKING ==="
  git branch -vv | grep '^\*'
  echo
  echo "=== PARKED EXCLUDE ENTRIES ==="
  tail -20 .git/info/exclude
} | tee /dev/tty | pbcopy
```

Expected:

- `git status --short` should be blank.
- Latest commit should be `6937d65 Fade unified shell badge edges`.
- Branch should be synced with origin.
- Parked files should be listed in `.git/info/exclude`.

## Pre-Commit Verify Pattern

Before committing any shell polish:


```zsh
cd /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab && {
  echo "=== PRE-COMMIT VERIFY ==="
  date
  echo
  echo "=== STATUS ==="
  git status --short
  echo
  echo "=== DIFF STAT ==="
  git diff --stat
  echo
  echo "=== PROTECTED FILES ==="
  git status --short build_lab.js gallery/index.html gallery/thumbs modules.manifest.json
} | tee /dev/tty | pbcopy
```

Expected for shell-only work:

` M unified_shell.html`

Protected files section should be blank.

## Safe Commit Pattern

For unified shell changes only:

```zsh
cd /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab
git add unified_shell.html
git commit -m "Short accurate shell commit message"
git push
```

Then verify:

```zsh
{
  echo "=== PUSH VERIFY ==="
  date
  echo
  echo "=== STATUS ==="
  git status --short
  echo
  echo "=== LATEST COMMIT ==="
  git log -1 --oneline
  echo
  echo "=== BRANCH TRACKING ==="
  git branch -vv | grep '^\*'
} | tee /dev/tty | pbcopy
```

## Current Design Preferences

Current visual direction:

- Noir
- CRT
- Monochrome
- Holographic but not colorful
- Black rail
- White/gray scan texture
- Subtle bloom
- Badge centered
- Logo strong and readable
- Badge center stays black
- Badge edges fade outward
- No colored wash
- No old blue UI styling
- No accidental module-wide edits

User has been tuning by eye at browser default desktop zoom.

Expect future adjustments around:

- logo scale
- logo vertical placement
- badge fade width
- badge black core size
- rail glow intensity
- CRT scanline density
- CRT noise opacity
- CRT noise speed
- CRT band height
- thumbnail opacity
- hamburger/settings positioning

## Useful CSS Targets

Rail:

- `.rail`
- `.rail::before`
- `.rail::after`
- `@keyframes noixzyRailCrtNoise`

Thumbs:

- `.thumbRail`
- `.moduleButton`
- `.moduleButton img`

Logo / Badge:

- `.logoOverlay`
- `.logoOverlay img`
- `.logoOverlay::before`
- `.logoOverlay::after`

Settings:

- `.settingsShell`
- `.settingsButton`
- `.settingsMenu`

Module frame:

- `#moduleFrame`

## Next Chat Instruction

Start by verifying repo status. Then continue editing `unified_shell.html` only unless the user explicitly says otherwise.
