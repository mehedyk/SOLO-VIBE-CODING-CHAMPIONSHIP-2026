# Future Potential Resources

All assets and landing pages in this directory have been created independently without modifying any existing repository files outside of this folder.

---

## 1. Websites

### 🌿 Meadowbell Hero Landing Page (`/meadowbell/index.html`)
- **Concept:** A single-file, self-contained landing hero for the animated kids' farming series *"Hollyoak's Plucky Sprout Squad"* from fictional studio Meadowbell.
- **Visuals:** Hand-painted anime (Ghibli-esque) aesthetic. Boy and beagle lie on a hillside looking up at cumulus clouds.
- **Layers:** 9:8 plate image (`3ca5d10d-ea2f-4907-876f-33bde169469e.jpg`) layered precisely with square looping video (`d2cb5bef-f92b-4e91-ae93-8dc6555e56ac.mp4`) at 100% width, 112.5% height, top -6.25% so the meadow grass ripples and hair flutters seamlessly.
- **Typography:** Grandstander 900 display typography and Inter.
- **Features:** Web Animations API entrance sequence, responsive cards with hover elevation and art zoom, mobile breakpoint support with swipeable card carousel.

### 🏛️ Meridian Footer (`/meridian/index.html`)
- **Concept:** Single, self-contained full-viewport footer section for "meridian".
- **Visuals:** Vintage engraved pen-and-ink illustration on pale sage (`#ebeee7`). Long stone arched viaduct bridge with stagecoach trotting across and exiting right.
- **Blending:** Video pure-white background blended invisibly with `mix-blend-mode: multiply` into the pale sage paper background.
- **Components:** Custom 8-point compass rose SVG mark, lowercase serif wordmark ("meridian"), tagline, dot-separated nav with left-to-right underline hover animation, dynamic copyright year, and IntersectionObserver video playback.
- **Responsive:** Fluid layout on desktop, clean 4×2 grid on tablet, 2×4 grid on mobile with zero vertical or horizontal overflow.

### 🗺️ Error 404 Page (`/error404/index.html`)
- **Concept:** Dedicated full-viewport 404 page adapting the Meridian vintage engraved viaduct aesthetic ("Off the Beaten Track").
- **Features:** Arched viaduct video background with multiply blending, custom engraved compass emblem, display serif typography, navigation back to home or Sprout Squad, completely responsive with zero scroll.

---

## 2. Generated Raster Images (`/images/`)
High-resolution raster PNG images created using AI image generation adhering to the brand palette: deep navy (`#0f2a43`), forest green (`#14532d`), amber (`#fbbf24`), mint (`#34d399`), and white.

| File Name | Dimensions | Description |
|---|---|---|
| `logo_mark.png` | 1024 × 1024 | Flat raster mark showing ten amber squares merging into one tall mint bar (10 ones exchanging into 1 ten) on deep navy. |
| `logo_mark_with_label.png` | 1024 × 1024 | Alternate branded logo mark with Primary Visual Lab label. |
| `logo_wordmark.png` | 1376 × 768 | Horizontal brand lockup with logo mark and English wordmark "Primary Visual Lab". |
| `bangla_wordmark.png` | 1376 × 768 | Horizontal brand lockup featuring the logo mark and crisp Bengali typography "প্রাইমারি ভিজ্যুয়াল ল্যাব". |
| `app_icon.png` | 1024 × 1024 | iOS squircle app icon on deep navy with 10 amber units transitioning into a mint ten-rod. |
| `apple-touch-icon.png` | 180 × 180 | Apple touch icon variant. |
| `icon-192.png` & `icon-512.png` | 192 × 192 / 512 × 512 | PWA and Android standard icons. |
| `favicon.ico` | Multi-size ICO | Multi-resolution favicon (16, 32, 48 px). |
| `readme_banner.png` | 1376 × 768 | GitHub repository README header banner with logo and "10 ones = 1 ten" place-value visualizer. |
| `social_og_image.png` | 1376 × 768 | Social / OpenGraph preview card: "See how numbers change", showing 52 − 27 regrouping with exchange arrow. |
| `teacher_splash_illustration.png` | 1200 × 896 | Warm classroom illustration of teacher's hand gesturing toward an interactive screen showing place-value blocks (no human faces). |
