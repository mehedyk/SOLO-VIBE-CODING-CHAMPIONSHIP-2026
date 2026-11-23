# Future Potential Resources

All assets and landing pages in this directory are maintained independently without modifying any existing repository files outside of this folder.

---

## 🎨 Redesigned Identity System: Primary Visual Lab / প্রাইমারি ভিজ্যুয়াল ল্যাব

The logo and brand identity have been rebuilt from the ground up to eliminate generic AI tropes (glossy 3D bubbles, floating cubes, neon sci-fi glows).

### 💡 The Bespoke Design Concept: The "P" Place-Value Monogram
- **Silhouette:** An iconic geometric letter **"P"** (standing for **Primary** Visual Lab).
- **The Stem (1 Ten):** A tall, solid mint-green ten-rod (`#34d399`) with 10 harmonious unit divisions.
- **The Loop (10 Ones):** Exactly 10 crisp, warm amber-yellow squares (`#fbbf24`) with rounded corners forming the upper bowl of the 'P' and docking into the pillar.
- **The Mathematical Metaphor:** Seamlessly illustrates **"10 ones = 1 ten"** (regrouping and place value) while acting as a bold, memorable lettermark.
- **Small-Scale Clarity:** Retains instant readability down to 16×16 favicon size without turning into mud.

---

## 📦 Brand Asset Files (`/images/`)

### 1. Logo Marks & Variations
| File Name | Format | Dimensions | Description |
|---|---|---|---|
| `logo_mark.png` | PNG | 2048 × 2048 | Core 'P' place-value mark centered on deep navy background (`#0f2a43`). |
| `logo_mark_transparent.png` | PNG | 2048 × 2048 | High-resolution mark on transparent background. |
| `logo_mark_white.png` | PNG | 2048 × 2048 | Pure monochrome white version for dark surfaces. |
| `logo_mark_monochrome_navy.png` | PNG | 2048 × 2048 | Pure monochrome navy version for light paper/print. |
| `logo_mark.svg` | SVG | Scalable vector | Clean, scalable vector code of the mark with zero raster clutter. |

### 2. Wordmarks (English & Bangla)
| File Name | Format | Dimensions | Description |
|---|---|---|---|
| `logo_wordmark.png` | PNG | 2400 × 800 | Horizontal lockup: mark + bold geometric sans "Primary Visual Lab" + amber "MATHEMATICS VISUALISER". |
| `logo_wordmark_transparent.png` | PNG | 2400 × 800 | Transparent horizontal English lockup. |
| `bangla_wordmark.png` | PNG | 2500 × 800 | Horizontal lockup: mark + authentic Bengali typography "প্রাইমারি ভিজ্যুয়াল ল্যাব" (with proper conjuncts প্র, ভ, জ্যু, ল্যা) + "গণিত ভিজ্যুয়ালাইজার". |
| `bangla_wordmark_transparent.png` | PNG | 2500 × 800 | Transparent horizontal Bangla lockup. |

### 3. App Icons & Favicon Suite
| File Name | Format | Dimensions | Description |
|---|---|---|---|
| `app_icon.png` | PNG | 1024 × 1024 | iOS squircle on deep navy with subtle matte border, mark in 80% safe zone. |
| `apple-touch-icon.png` | PNG | 180 × 180 | High-res Apple Touch icon for iOS home screens. |
| `icon-192.png` & `icon-512.png` | PNG | 192×192 / 512×512 | Standard PWA web manifest icons. |
| `icon-maskable-512.png` | PNG | 512 × 512 | Android adaptive maskable icon with safe-zone margin. |
| `favicon.ico` | ICO | 16, 32, 48 px | Multi-resolution favicon container for browser tabs. |
| `favicon.svg` | SVG | Scalable vector | Modern SVG favicon for crisp vector rendering in modern browsers. |

### 4. Alternative Artistic Concept Explorations
| File Name | Description |
|---|---|
| `art_concept_p_monogram.png` | High-impact Swiss modernist 2D illustration of the 'P' Monogram. |
| `art_concept_tens_frame.png` | Modernist 2×5 tens-frame array interfacing with the mint pillar. |
| `art_concept_geometric_arch.png` | Dynamic geometric arch of 10 blocks docking into the ten-rod. |
| `art_concept_interlocking_frame.png` | Compact architectural interlock design. |
| `art_concept_app_icon.png` | Alternate app icon styling. |

### 5. Marketing & Classroom Illustrations
| File Name | Dimensions | Description |
|---|---|---|
| `readme_banner.png` | 1376 × 768 | GitHub repository README banner with logo and "10 ones = 1 ten" infographic. |
| `social_og_image.png` | 1376 × 768 | OpenGraph social preview: "See how numbers change" with 52 − 27 regrouping. |
| `teacher_splash_illustration.png` | 1200 × 896 | Warm classroom illustration of teacher's hand pointing at touch screen math manipulatives (no human faces). |

---

## 🌐 Websites

- **🌿 Meadowbell Hero Landing Page:** [`/meadowbell/index.html`](file:///k:/Hackathons/SOLO-VIBE-CODING-CHAMPIONSHIP-2026/future%20potential%20resources/meadowbell/index.html)
  - **Quality Enhancements:**
    - Downloaded and packaged all original full-fidelity media locally under [`meadowbell/assets/`](file:///k:/Hackathons/SOLO-VIBE-CODING-CHAMPIONSHIP-2026/future%20potential%20resources/meadowbell/assets/) to avoid CloudFront CDN latency and streaming compression drops.
    - **Eliminated Sky Pixel Breaking:** The 960×960 video originally stretched across the entire viewport, covering the 2160×1920 plate with 8-bit YUV 4:2:0 macroblocking in the sky gradient. Using an intelligent vertical gradient mask, the upper sky and cumulus clouds (which are static in the scene) now preserve the full, pristine 2K hand-painted plate resolution, while the dynamic middle and bottom layers (rippling grass, nodding daisies, boy's fluttering shirt and hair, dog's ears) play in seamless motion.
    - **Anti-Jitter GPU Compositing:** Added `transform: translate3d(0, 0, 0)` and hardware layer acceleration to prevent subpixel fractional rounding tearing on Windows high-DPI screens.
    - **Film Cel Dither:** Added microscopic film grain overlay to eliminate digital color quantization stepping.
    - **High-Res Chapter Cards:** Enhanced micro-contrast on all 3 chapter cards with retina 2x resolution.
- **🏛️ Meridian Footer:** [`/meridian/index.html`](file:///k:/Hackathons/SOLO-VIBE-CODING-CHAMPIONSHIP-2026/future%20potential%20resources/meridian/index.html)
- **🗺️ Error 404 Page:** [`/error404/index.html`](file:///k:/Hackathons/SOLO-VIBE-CODING-CHAMPIONSHIP-2026/future%20potential%20resources/error404/index.html)
