# Kid Chronicle — Design Specification

## 1. Aesthetic Direction: **Storybook Editorial**

A hybrid of editorial magazine clarity and the tactile warmth of a hand-bound family journal. This is NOT a children's app — it's a parent's tool that celebrates childhood. Think: a beautifully typeset annual report about the two most important people in your life. Structured enough to hold years of data, warm enough to feel like opening a treasured notebook. Confident, narrative-driven, quietly emotional.

## 2. Color Palette

| Role                      | Color          | Hex       |
| ------------------------- | -------------- | --------- |
| **Background (dominant)** | Warm Parchment | `#FAF4ED` |
| **Text & Structure**      | Deep Walnut    | `#3B2F2F` |
| **Accent**                | Saffron Flame  | `#E8913A` |

Light mode only. The parchment warmth is non-negotiable — no cold whites, no blue-grays. All borders and dividers use Deep Walnut at 12% opacity (`#3B2F2F1F`). Hover/active states use Saffron Flame. Disabled states use Walnut at 30%.

**Category color-coding** (used for timeline dots, tags, and card left-borders):

- Education: `#4A7FB5` (slate blue)
- Activities: `#5B9A6F` (sage green)
- Competitions: `#D4793A` (burnt orange)
- Summer Camps: `#C4A43E` (golden)
- Vacation Trips: `#8B6BAE` (soft violet)
- Growth/Health: `#D4697A` (dusty rose)

## 3. Typography

**Display: "Fraunces"** (Google Fonts) — soft-serif optical font with warmth, personality, and variable weight. Used for kid names, section headers, milestone titles.

- H1: 40px / weight 800 / letter-spacing -0.02em
- H2: 28px / weight 700
- H3: 20px / weight 600

**Body: "Source Sans 3"** (Google Fonts) — clean, humanist sans-serif with excellent legibility. Used for all data, labels, descriptions, form controls.

- Body: 16px / weight 400 / line-height 1.6
- Caption/metadata: 13px / weight 400 / text-transform uppercase / letter-spacing 0.05em
- Data/numbers: 16px / weight 600 (tabular numerals via `font-variant-numeric: tabular-nums`)

## 4. Spatial Style

**Airy and structured.** The app breathes — generous vertical rhythm (48–64px gaps between sections) lets each memory feel important, not crammed.

- **Layout:** Persistent left sidebar (280px) with kid avatars (circular, 64px, showing initials in Fraunces Bold on a soft saffron background) + navigation. Wide right content area.
- **Cards:** 24px internal padding, 1px border in `#3B2F2F1F`, 12px border-radius. No drop shadows at rest — content earns attention through typography, not decoration.
- **Grid:** Content area uses a single column for timeline/narrative views, two-column grid (1fr 1fr) for dashboard stat cards and category overviews. 24px gap.
- **Kid switcher:** Top of sidebar — two avatar circles side by side. Active kid has a 3px saffron ring. Tap to switch; all content transitions with a 200ms ease fade.
- **Mobile:** Single column, sidebar collapses to a top bar with kid avatar toggle and hamburger nav.

## 5. Signature Detail: **The Living Timeline Spine**

A continuous vertical line (2px, Deep Walnut at 20% opacity) runs down the left edge of the content area on timeline views. At each event, a **solid category-colored circle (12px)** sits on the spine, connected to its content card by a thin 1px horizontal rule.

The key moment: a **pulsing "heartbeat" dot** marks TODAY's position on the timeline. It glows with a soft saffron radiance — a CSS keyframe animation cycling a `box-shadow` from `0 0 0 0 rgba(232,145,58,0.4)` to `0 0 0 8px rgba(232,145,58,0)` over 2s ease-in-out, looping infinitely. This single animation makes the entire record feel alive and ongoing — a living document, not an archive.

**Hover behavior:** Timeline nodes scale from 12px to 18px on hover (150ms ease), and the connected card lifts with `box-shadow: 0 4px 20px rgba(59,47,47,0.1)` — a subtle "picking up a photo from the table" feeling.

**Dual-kid view:** When viewing both children together, Nirek's events align left of the spine, Mishka's align right. Shared events (family trips) bridge across with a horizontal connector. Each side is labeled with a small monogram ("N" / "M") in the kid's avatar style.
