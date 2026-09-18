# PoultryTrack Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere
- **Archetype**: Industrial Field-Worker Terminal POS (wet-market touch workstation).
- **Environment**: Meja lapak pasar tradisional, percikan air/minyak, jari basah/bersarung tangan, pencahayaan subuh remang.
- **Tone**: Pragmatis, high-contrast, zero-distraction, authentic hardware tactile feel.
- **Surface**: Pure monochrome slate-graphite (`#0b0e14`, `#131822`, `#1a2230`), razor-sharp 1px structural borders (`#232d40`), solid physical press states.

## 2. Color Palette & Roles (Anti-Rainbow Palette)
- **Canvas / Background**: `#0b0e14`
- **Surface Panel**: `#131822`
- **Elevated Key / Card**: `#1a2230`
- **Hover / Active State**: `#232f45`
- **Borders**: `#232d40` (subtle), `#344460` (focused/selected)
- **Primary Accent (Action / Submit)**: `#10b981` (Muted Industrial Emerald)
- **Warning / Unpaid Bon**: `#f43f5e` (Crimson - strictly for overdue ledger debt)
- **Text Primary**: `#f1f5f9` (High contrast readability)
- **Text Secondary**: `#94a3b8` (Muted metadata)
- **Text Muted**: `#64748b` (Labels and hints)

## 3. Typography & Numerical Formatting
- **Display / Body UI**: Native System Sans (`-apple-system`, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto) with natural sentence casing. No decorative uppercase screaming.
- **Tabular Figures**: `JetBrains Mono`, SFMono-Regular, monospace strictly for weights (`kg`), prices (`Rp`), timestamps, and numeric counters with `font-variant-numeric: tabular-nums`.

## 4. Hardware Tactile Touch Ergonomics
- **Minimum Touch Target**: 48px - 56px height to ensure zero missed taps with wet fingers.
- **Physical Bevel Effect**: Subtle 1px inner top border highlight (`rgba(255, 255, 255, 0.05)`) mimicking physical membrane keypad buttons.
- **Micro-haptics & Motion**: `scale(0.97)` active press state, cubic-bezier(0.16, 1, 0.3, 1), 120ms duration. Zero sluggish ease-in animations.
- **Synthetic Audio**: Low-latency synthetic click generated via Web Audio API oscillator for instant audio confirmation in noisy market conditions.
