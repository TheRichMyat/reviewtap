# Scan & Say — Brand Handoff Template

> Hand this entire document to ChatGPT (with image generation enabled) to produce all visual assets needed for the rebrand. Each section's prompt is copy-paste ready. Generate one asset at a time for best results.

---

## 1. BRAND BASICS

**Product name:** Scan & Say
**Wordmark:** `Ss.` (capital S + lowercase s + period)
**Tagline (working):** *"Every great visit deserves a good word."*
**One-line product description:**
*A free mobile app that generates branded QR codes for small businesses, sending their customers straight to a Google or Facebook review page in one tap.*

**Voice & tone:**
- Friendly, confident, never pushy
- Minimal — Stripe/Notion-level clean
- Built for small business owners (cafés, salons, mechanics, retail)
- Imperative-action feel — same energy as "Stop & Shop", "Shake & Bake"

**What we are NOT:**
- Not an NFC card seller (all our competitors are)
- Not subscription software
- Not a hardware product

---

## 2. VISUAL IDENTITY

### Colors

**Primary gradient (keep existing — already loved by the brand):**
- Start: `#4F6DFF` (electric blue)
- End: `#9B30FF` (violet)
- Direction: 135° (top-left to bottom-right) or 90° (left to right) depending on context

**Solid colors:**
- White: `#FFFFFF`
- Text dark: `#1A1A1A`
- Text muted: `#6B7280`
- Light background: `#F5F5F7`
- Danger red: `#DC2626`
- Border gray: `#E5E7EB`

**Use of color:**
- Gradient is used sparingly — primary CTAs, hero stat cards, wordmark fills
- Most surfaces are white with dark text
- Brand color should feel intentional, not decorative

### Typography

**Wordmark / logo:** Archivo Black (700/900 weight only) — bold geometric sans-serif
**UI body text:** Inter (regular, medium, semibold, bold) — clean sans-serif

The wordmark `Ss.` MUST always be rendered in Archivo Black. Never substitute another font.

### Wordmark composition

- Capital `S`, then lowercase `s`, then a period `.`
- Letters touching or with tight kerning
- Period sits at the baseline, same weight as the letters
- White on gradient, OR gradient text on white (using mask)
- No drop shadows, no outlines, no effects

---

## 3. ASSET CHECKLIST

| # | Asset | Format | Size | Purpose |
|---|---|---|---|---|
| 1 | Adaptive icon (Android) | PNG, transparent or solid | 1024×1024 | Home screen icon, requires ~20% safe-zone padding |
| 2 | App icon (iOS / Play Store listing) | PNG, no transparency | 1024×1024 | Listing thumbnail, slightly less padding |
| 3 | Splash screen | PNG | 1284×2778 (portrait) | Shown for ~1.5s when app launches |
| 4 | In-app logo / wordmark | PNG, transparent bg | 512×512 | Used inside Settings, splash, login |
| 5 | Web favicon | PNG | 192×192 | Browser tab icon |
| 6 | Feature graphic (Play Store) | PNG | 1024×500 | Top banner on Play Store listing |
| 7 | Marketing wallpaper / social | PNG | 1920×1080 | Optional — for Twitter/Instagram |

---

## 4. CHATGPT PROMPTS — COPY PASTE EACH ONE

### Prompt 1 — Adaptive App Icon (Android)

```
Generate a 1024x1024 square app icon for a mobile app called "Scan & Say".

Background: full diagonal gradient from #4F6DFF (top-left, electric blue) to
#9B30FF (bottom-right, violet). No texture. No noise. Clean solid gradient.

Center the wordmark "Ss." in pure white. The "S" is uppercase, the "s" is
lowercase, followed by a period. Use Archivo Black or a heavy geometric
sans-serif (bold, geometric, similar to Archivo Black 900 weight).

The wordmark must occupy approximately 50% of the canvas width — centered both
horizontally and vertically. Leave 20% empty padding on all four sides
(safe zone for Android launcher cropping).

Style: minimalist, premium, modern. No drop shadows, no outlines, no extra
decoration. Just the gradient background and the white wordmark.

Output: 1024x1024 PNG.
```

### Prompt 2 — Regular App Icon (iOS / Play Store)

```
Same as the adaptive icon, but the wordmark "Ss." occupies approximately 65%
of the canvas width (less padding needed because this version isn't cropped
by launcher shapes).

Specs:
- 1024x1024 PNG
- Diagonal gradient #4F6DFF (top-left) to #9B30FF (bottom-right)
- White "Ss." in heavy geometric sans-serif (Archivo Black style)
- Center-aligned, ~65% width
- No transparency, no effects
```

### Prompt 3 — Splash Screen

```
Generate a 1284x2778 portrait phone splash screen for a mobile app called "Scan & Say".

Background: full diagonal gradient from #4F6DFF (top-left) to #9B30FF
(bottom-right). Clean, no noise.

Centered both horizontally and vertically:
- A small square logo containing the wordmark "Ss." (white, on a darker
  gradient block, similar to the app icon — about 200x200 pixels)
- 32 pixels below that, the full app name "Scan & Say" in white,
  geometric heavy sans-serif (Archivo Black), about 80px tall

That's it. No other elements. Plenty of empty space above and below.

Output: 1284x2778 PNG.
```

### Prompt 4 — In-App Logo (transparent background)

```
Generate a 512x512 PNG with a TRANSPARENT background.

Center a square gradient block (450x450, with 16px rounded corners) inside.
The gradient runs from #4F6DFF (top-left) to #9B30FF (bottom-right).

Inside the block, center the wordmark "Ss." in pure white, in heavy
geometric sans-serif (Archivo Black). The wordmark should be about 55% of
the block's width.

No effects, no outlines outside the block. Just a clean gradient square
with the white wordmark.

Output: 512x512 PNG with transparent background outside the block.
```

### Prompt 5 — Web Favicon

```
Generate a 192x192 PNG square favicon for the Scan & Say website.

Solid background: gradient from #4F6DFF (top-left) to #9B30FF (bottom-right).

Center the wordmark "Ss." in pure white, heavy geometric sans-serif
(Archivo Black), occupying about 60% of the canvas width.

Clean, minimal. Same visual language as the app icon but optimized for
small favicon sizes (still legible at 16x16).

Output: 192x192 PNG.
```

### Prompt 6 — Play Store Feature Graphic

```
Generate a 1024x500 horizontal banner for the Google Play Store listing of
a mobile app called "Scan & Say".

Layout:
- LEFT THIRD of the banner: a 350x350 square gradient logo block with
  rounded corners (24px radius), gradient from #4F6DFF (top-left) to
  #9B30FF (bottom-right). Inside the block, the wordmark "Ss." in white,
  heavy geometric sans-serif, occupying 55% of the block's width.
- RIGHT TWO-THIRDS: pure white background.
  - Headline (top): "Scan & Say" in #1A1A1A, heavy geometric sans-serif,
    very large (about 100px tall), bold
  - Subhead (below, 24px gap): "Turn every customer into a 5-star review."
    in #6B7280, regular weight, about 36px tall

Plenty of white space. No additional decoration, no icons, no illustrations.

Style: Stripe / Notion / Linear level minimalism. Premium feel.

Output: 1024x500 PNG.
```

### Prompt 7 — Social media wallpaper (optional, 1920x1080)

```
Generate a 1920x1080 horizontal social media banner for "Scan & Say".

Background: full diagonal gradient from #4F6DFF (top-left) to #9B30FF
(bottom-right). Clean, no noise.

Center vertically and slightly left of center horizontally:
- The wordmark "Ss." in pure white, heavy geometric sans-serif (Archivo
  Black style), very large — about 400px tall.

To the right of the wordmark (or below it on its own line), in white text
at about 80px tall: "Every great visit deserves a good word."

Lots of negative space. Premium, calm, modern.

Output: 1920x1080 PNG.
```

---

## 5. CHATGPT WORKFLOW TIPS

- **Generate one asset at a time.** Don't batch — ChatGPT does each one better with focused attention.
- **If letters render weird** (Ss. comes out as 5s. or Ss without period, etc.), tell ChatGPT: *"Regenerate. The wordmark must be exactly capital S, lowercase s, followed by a period. Three characters total: S, s, ."*
- **If the gradient looks muddy** in the middle, tell ChatGPT: *"Use a cleaner two-color linear gradient. No blending into gray in the middle."*
- **Save outputs** as `icon-1024.png`, `splash.png`, etc. into your `mobile/assets/` folder, replacing the existing files.
- **Iterate 2-3 times** per asset until it looks right. ChatGPT image gen isn't perfect on first try.

---

## 6. ALTERNATIVE: SCRIPT-BASED GENERATION

You already have a Sharp-based icon generator script at `mobile/scripts/pad-icon.js`. If ChatGPT image generation gives you trouble (especially with text rendering), I can update the script in 5 minutes to generate the new "Ss." wordmark on gradient with perfect consistency at any size.

The script approach:
- ✅ Pixel-perfect text rendering (uses real SVG + Archivo Black)
- ✅ Scales to any size from 16×16 to 4096×4096
- ✅ Consistent across all assets (icon, splash, favicon)
- ✅ Re-runnable if you ever tweak the color
- ⚠️ Less "creative variation" — what you specify is what you get

Just tell me to do it and I'll switch the script to "Ss." + your chosen color palette.

---

## 7. CHECKLIST FOR YOU AFTER GENERATING

- [ ] All 7 assets generated and saved
- [ ] Files dropped into `mobile/assets/`:
  - `icon.png` (the regular app icon)
  - `adaptive-icon.png` (the Android adaptive version)
  - `splash.png`
  - `logo.png` (in-app logo, 512×512)
- [ ] Files dropped into `landing/public/assets/`:
  - `logo.png` (same as in-app, or favicon size)
- [ ] Feature graphic saved separately for Play Store upload
- [ ] Confirm me when done — I'll do the code rebrand (RT. → Ss., ReviewTap → Scan & Say, color usage updates) and push.

---

## 8. REFERENCE — WHAT THE OLD BRAND LOOKED LIKE

For ChatGPT to understand the visual heritage we're keeping:

- The previous app icon was a gradient square with "RT." in white Archivo Black, centered
- Same gradient (#4F6DFF → #9B30FF) is being kept
- Only the wordmark is changing: `RT.` → `Ss.`
- The aesthetic — minimalist, premium, geometric — is staying

So this is a wordmark swap on a known-good visual system, not a ground-up redesign.

---

*Generated for the Scan & Say rebrand from ReviewTap. Created by Claude as the design strategy handoff.*
