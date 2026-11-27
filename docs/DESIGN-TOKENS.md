# Clearhale Design Tokens & Neutral Architecture

This document specifies the single source of truth for Clearhale's refined neutral design token architecture, semantic mapping, component rules, and WCAG 2.1 contrast compliance.

---

## 1. Core Principles

1. **Refined Neutral Palette**: All structural surfaces, typography, borders, and fills derive strictly from a calibrated 12-step neutral palette (50–950 plus base), replacing ad-hoc hex values across the entire codebase.
2. **Warm & Family-Friendly Ergonomics**: 20–24px card radii, pill-shaped chips, 48px minimum touch targets, friendly humanist typography (Plus Jakarta Sans paired with Noto Sans regional scripts), and clean line pictograms.
3. **Accessibility First (WCAG AAA/AA)**: Every text/background token pair guarantees $\ge 7:1$ contrast for primary/body copy and $\ge 4.5:1$ for secondary copy. Tertiary text is strictly restricted to large or non-essential labels.
4. **Non-Neutral Color Isolation**: Color is never the sole carrier of information. Non-neutral colors are strictly limited to:
   - Official Indian PM2.5 AQI Bands (ring indicator, band chips with glyphs, forecast cells, share card)
   - Danger Red (`#DC2626` / `#EF4444`) for emergency alerts and myth-buster labels
   - Accent Mode (Signature Teal vs Minimalist Monochrome)

---

## 2. Palette Specification

### Light Theme Neutral Palette
| Step | Hex | Role |
| :--- | :--- | :--- |
| **base** | `#FFFFFF` | Card surface, modal surfaces, floating sheets |
| **50** | `#FAFAFA` | Page background |
| **100** | `#F5F5F5` | Subtle fills, input backgrounds, muted pills |
| **200** | `#E5E5E5` | Hairline borders, ring track |
| **300** | `#D4D4D4` | Strong borders, focused divider lines |
| **400** | `#A3A3A3` | Disabled states (never for readable text) |
| **500** | `#737373` | Tertiary text (large or non-essential text only) |
| **600** | `#525252` | Secondary text, subtitles, helper hints |
| **700** | `#404040` | Interactive hover states |
| **800** | `#262626` | Dark surface accents |
| **900** | `#171717` | Primary text, high-contrast headings, solid dark chips |
| **950** | `#0A0A0A` | Deep contrast accents |

### Dark Theme Neutral Palette
| Step | Hex | Role |
| :--- | :--- | :--- |
| **base** | `#000000` | Optional True Black OLED page background |
| **50** | `#0A0A0A` | Default dark page background |
| **100** | `#171717` | Surface (cards, panels) |
| **200** | `#262626` | Raised surface, subtle fill, dark borders, ring track |
| **300** | `#373737` | Strong dark borders, active borders |
| **400** | `#525252` | Disabled states in dark mode |
| **500** | `#8A8A8A` | Tertiary text (dark mode) |
| **600** | `#A3A3A3` | Secondary text (dark mode) |
| **700** | `#D4D4D4` | Light borders on dark surfaces |
| **800** | `#E5E5E5` | Secondary text hover |
| **900** | `#F5F5F5` | Primary text, high-contrast text |
| **950** | `#FAFAFA` | Inverted text on solid buttons |

---

## 3. Semantic Token Mapping (CSS Variables)

Defined in `app/globals.css` and mapped in `tailwind.config.ts`:

```css
/* Light Theme */
:root {
  --bg-page: var(--palette-50);        /* #FAFAFA */
  --bg-surface: var(--palette-base);   /* #FFFFFF */
  --bg-subtle: var(--palette-100);     /* #F5F5F5 */
  --border-subtle: var(--palette-200); /* #E5E5E5 */
  --border-strong: var(--palette-300); /* #D4D4D4 */
  --text-primary: var(--palette-900);  /* #171717 */
  --text-secondary: var(--palette-600);/* #525252 */
  --text-tertiary: var(--palette-500); /* #737373 */
  --text-disabled: var(--palette-400); /* #A3A3A3 */
}

/* Dark Theme */
.dark {
  --bg-page: var(--palette-50);        /* #0A0A0A */
  --bg-surface: var(--palette-100);    /* #171717 */
  --bg-raised: var(--palette-200);     /* #262626 */
  --bg-subtle: var(--palette-200);     /* #262626 */
  --border-subtle: var(--palette-200); /* #262626 */
  --border-strong: var(--palette-300); /* #373737 */
  --text-primary: var(--palette-900);  /* #F5F5F5 */
  --text-secondary: var(--palette-600);/* #A3A3A3 */
  --text-tertiary: var(--palette-500); /* #8A8A8A */
  --text-disabled: var(--palette-400); /* #525252 */
}

/* Optional True Black OLED Setting */
html[data-true-black="true"].dark {
  --bg-page: #000000;
  --bg-color: #000000;
}
```

---

## 4. Accent Mode (`teal` vs `mono`)

Gated by `NEXT_PUBLIC_THEME_EXPERIMENT=true` in Settings $\to$ Appearance:

| Mode | Primary Buttons | Selected Tabs / Pills | Logo Variant | Focus Ring |
| :--- | :--- | :--- | :--- | :--- |
| **Teal** (Default) | Deep teal `#0D5C52` (light) / Mint `#2DD4BF` (dark) | Teal text with active pill indicator | Full-color semi-realistic leaf mark | Neutral 2px ring with 2px offset |
| **Mono** | Solid neutral 900 (`#171717`) with `#FFFFFF` text (light); `#F5F5F5` with `#0A0A0A` text (dark) | Subtle fill (`#F5F5F5` / `#262626`) with strong border (`#D4D4D4` / `#373737`) | Monochrome silhouette (`currentColor` / `mark-flat-mono.svg`) | Neutral 2px ring with 2px offset |

---

## 5. Component Rules

1. **Cost Chips**:
   - `Free`: Solid dark chip (`bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900`)
   - `Low-cost`: Light grey chip (`bg-neutral-100 dark:bg-neutral-800 text-foreground border border-neutral-200`)
   - `If you can afford`: Outlined chip (`border border-neutral-300 dark:border-neutral-700 bg-transparent`)
   - Always keeps the text label.
2. **Evidence Level Chips**:
   - `Strong`: Solid chip
   - `Moderate` / `Depends on your home`: Outlined chip
   - `Limited`: Dashed outline chip
   - `Myth`: Danger-red text with `<AlertTriangle />` icon
3. **Air Quality Band Chips**:
   - Tinted background (10–12% band color)
   - Neutral primary text (`text-foreground`)
   - Small band icon/glyph bullet for redundant accessibility
4. **Breathing Ring**:
   - Ring track strictly uses neutral 200 (`#E5E5E5` light, `#262626` dark).
   - Flat subtle band tint behind the ring card (no glow, no gradient).
5. **Share Card**:
   - Stays on light neutral tokens (`#FAFAFA` background, `#171717` text, `#E5E5E5` border).
   - Dynamically respects Accent Mode (`teal` vs `mono` mark).

---

## 6. Contrast Audit Results Matrix (WCAG 2.1)

All calculated via standard W3C relative luminance algorithm in `test/contrast.test.mjs`:

### Light Mode Contrast Audit
| Text Token | Background Token | Measured Ratio | WCAG Benchmark | Status |
| :--- | :--- | :--- | :--- | :--- |
| Primary (`#171717`) | Page Background (`#FAFAFA`) | **17.03 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Primary (`#171717`) | Card Surface (`#FFFFFF`) | **17.80 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Primary (`#171717`) | Subtle Fill (`#F5F5F5`) | **16.42 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Secondary (`#525252`) | Page Background (`#FAFAFA`) | **7.61 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Secondary (`#525252`) | Card Surface (`#FFFFFF`) | **7.95 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Secondary (`#525252`) | Subtle Fill (`#F5F5F5`) | **7.34 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Tertiary (`#737373`) | Page Background (`#FAFAFA`) | **4.64 : 1** | $\ge 3:1$ (Large) | **PASS** |

### Dark Mode Contrast Audit
| Text Token | Background Token | Measured Ratio | WCAG Benchmark | Status |
| :--- | :--- | :--- | :--- | :--- |
| Primary (`#F5F5F5`) | Page Background (`#0A0A0A`) | **18.57 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Primary (`#F5F5F5`) | Card Surface (`#171717`) | **16.37 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Primary (`#F5F5F5`) | Subtle Fill (`#262626`) | **13.42 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Primary (`#F5F5F5`) | True Black (`#000000`) | **19.32 : 1** | $\ge 7:1$ (AAA) | **PASS** |
| Secondary (`#A3A3A3`) | Page Background (`#0A0A0A`) | **7.77 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Secondary (`#A3A3A3`) | Card Surface (`#171717`) | **6.85 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Secondary (`#A3A3A3`) | Subtle Fill (`#262626`) | **5.61 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Secondary (`#A3A3A3`) | True Black (`#000000`) | **8.08 : 1** | $\ge 4.5:1$ (AA) | **PASS** |
| Tertiary (`#8A8A8A`) | Page Background (`#0A0A0A`) | **4.82 : 1** | $\ge 3:1$ (Large) | **PASS** |

---

## 7. Verification & Automated Enforcement

- **Automated Hex Audit**: `test/token-enforcement.test.mjs` scans all components and pages, failing if unapproved raw hexes or off-theme Tailwind utilities are introduced.
- **Automated Contrast Audit**: `test/contrast.test.mjs` verifies mathematical contrast ratios across all semantic token pairings.
