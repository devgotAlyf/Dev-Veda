# VedaAI — Design System

> Generated from Stitch MCP design configuration.
> Single source of truth for all visual tokens across the application.

---

## Brand Identity

**Name**: VedaAI
**Tagline**: AI-Powered Assessment Creator
**Logo**: "✦ VedaAI" — Merriweather 900, amber glyph (✦), cream text on navy
**Personality**: Academic, trustworthy, premium — like Notion meets a university examination board

---

## Color Palette

### Primary
| Token               | Hex       | Usage                        |
|---------------------|-----------|------------------------------|
| `--color-navy`      | `#0F172A` | Primary bg, headings         |
| `--color-navy-800`  | `#1E293B` | Sidebar, cards               |
| `--color-navy-700`  | `#334155` | Borders, dividers            |

### Surface
| Token               | Hex       | Usage                        |
|---------------------|-----------|------------------------------|
| `--color-cream`     | `#FFFDF7` | Page background              |
| `--color-cream-100` | `#F5F0E8` | Input backgrounds            |

### Accent
| Token                | Hex       | Usage                        |
|----------------------|-----------|------------------------------|
| `--color-amber`      | `#D97706` | CTA buttons, accents         |
| `--color-amber-light`| `#FDE68A` | Hover states                 |

### Semantic
| Token            | Hex       | Usage                        |
|------------------|-----------|------------------------------|
| `--color-sage`   | `#4D7C6F` | Success, easy badge          |
| `--color-rose`   | `#BE123C` | Error, hard badge            |
| `--color-honey`  | `#92400E` | Medium badge                 |

### Text
| Token            | Hex       | Usage                        |
|------------------|-----------|------------------------------|
| `--color-ink`    | `#1C1917` | Body text                    |
| `--color-muted`  | `#78716C` | Placeholder, captions        |

---

## Typography

### Fonts
| Role     | Family                          | Weights     | Usage                                |
|----------|---------------------------------|-------------|--------------------------------------|
| Serif    | Merriweather, Georgia, serif    | 400,700,900 | ALL headings, labels, section titles, exam paper text, logo |
| Sans     | Inter, system-ui, sans-serif    | 400,500,600 | Body text, inputs, badges, helper text, metadata |

### Scale
| Level       | Font          | Size  | Weight | Letter-spacing |
|-------------|---------------|-------|--------|----------------|
| Display     | Merriweather  | 36px  | 900    | -0.02em        |
| H1          | Merriweather  | 28px  | 700    | -0.01em        |
| H2          | Merriweather  | 22px  | 700    | 0              |
| H3          | Merriweather  | 18px  | 700    | 0              |
| Body        | Inter         | 15px  | 400    | 0              |
| Body Medium | Inter         | 15px  | 500    | 0              |
| Small       | Inter         | 13px  | 400    | 0.01em         |
| Caption     | Inter         | 11px  | 500    | 0.03em         |
| Label       | Merriweather  | 13px  | 700    | 0.05em         |

---

## Spacing

| Token           | Value                     |
|-----------------|---------------------------|
| `--spacing-page`| `clamp(24px, 5vw, 64px)`  |
| `--spacing-xs`  | `4px`                     |
| `--spacing-sm`  | `8px`                     |
| `--spacing-md`  | `16px`                    |
| `--spacing-lg`  | `24px`                    |
| `--spacing-xl`  | `32px`                    |
| `--spacing-2xl` | `48px`                    |
| `--spacing-3xl` | `64px`                    |

---

## Shape & Borders

| Token            | Value                              |
|------------------|------------------------------------|
| `--radius-sm`    | `4px`                              |
| `--radius-md`    | `8px`                              |
| `--radius-lg`    | `16px`                             |
| `--radius-pill`  | `999px`                            |
| `--border-ink`   | `1px solid rgba(28,25,23,0.12)`    |
| `--border-amber` | `1px solid rgba(217,119,6,0.3)`    |

---

## Shadows

| Token              | Value                                                    |
|--------------------|----------------------------------------------------------|
| `--shadow-paper`   | `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)` |
| `--shadow-lifted`  | `0 8px 32px rgba(15,23,42,0.12)`                         |

---

## Texture

Apply a subtle paper grain noise on the cream background via a CSS pseudo-element:
- Method: SVG-based noise filter or data-URI pattern
- Opacity: 3-5% — barely perceptible
- Blend mode: multiply
- Covers full viewport on `body::before`

---

## Component Patterns

### Buttons
| Variant   | Background      | Text          | Border         | Hover             |
|-----------|-----------------|---------------|----------------|-------------------|
| Primary   | `--color-amber` | white         | none           | `--color-amber-light` bg, navy text |
| Ghost     | transparent     | `--color-ink` | `--border-ink` | cream-100 bg      |
| Danger    | transparent     | `--color-rose`| rose border    | rose/10 bg        |

### Form Inputs
- Background: `--color-cream-100`
- Border: `--border-ink`
- Focus ring: 2px `--color-amber` with 4px offset
- Label: Merriweather 700, small-caps, above input
- Error state: rose border, rose helper text

### Badges
| Type    | Background       | Text           | Border         |
|---------|------------------|----------------|----------------|
| Easy    | sage/15          | sage           | sage/30        |
| Medium  | honey/15         | honey          | honey/30       |
| Hard    | rose/15          | rose           | rose/30        |
| Marks   | navy             | cream          | none           |

### Sidebar
- Width: 240px (collapses to bottom nav on mobile < 768px)
- Background: `--color-navy-800`
- Active link: 3px left amber border, slightly lighter navy bg
- Logo at top: ✦ VedaAI in Merriweather 900, cream text

### Section Dividers
- Double-line style: two 1px lines 3px apart in `--color-navy-700`
- NOT plain `<hr>` elements

---

## Responsive Breakpoints

| Breakpoint | Width   | Layout Changes                              |
|------------|---------|---------------------------------------------|
| Mobile     | < 768px | Sidebar → bottom nav (4 icons), stacked layout, action bar → bottom fixed |
| Tablet     | 768px+  | Sidebar visible, responsive content area    |
| Desktop    | 1280px+ | Full layout, max-width containers           |

---

## Animation Patterns

| Element              | Animation                                    |
|----------------------|----------------------------------------------|
| Toast                | Slide up from bottom-right, auto-dismiss 4s  |
| Generating overlay   | Typewriter text animation (1 char at a time) |
| Progress bar         | Smooth width transition (0.5s ease)          |
| Pill toggles         | Scale + color transition (0.2s)              |
| Sidebar links        | Left border slide-in (0.15s)                 |
| Page transitions     | Fade-in (0.3s)                               |
