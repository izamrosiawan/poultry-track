# PoultryTrack Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere
- **Archetype**: Field-Worker Touch Operating System / Wet-Market Point-of-Sale (Linear-Clean meets Apple Touch ergonomics).
- **Environment**: Extreme damp conditions (meja lapak pasar basah, percikan air, jari berminyak/basah, pencahayaan subuh remang).
- **Tone**: Ultra-legible, zero-distraction, high-contrast, physical button feel.
- **Surface**: Deep obsidian slate (`#070a0f` to `#0f1523`), razor-sharp 1px border (`#1c2638`), solid tactile cards.

## 2. Color Palette & Roles
- **Canvas / Background**: `#070a0f`
- **Surface Card**: `#0f1523`
- **Elevated Button / Key**: `#151e30`
- **Borders**: `#1c2638` (default), `#283852` (active/selected)
- **Primary Accent / Money**: `#10b981` (Vibrant Emerald)
- **Secondary Accent / Action**: `#38bdf8` (High-contrast Sky Blue)
- **Warning / Alert (Bon/Unpaid)**: `#f43f5e` (Rose Crimson)
- **Text Primary**: `#ffffff` (High contrast)
- **Text Secondary**: `#94a3b8`

## 3. Typography & Numerical Formatting
- **Font Display / Body**: System Sans (`-apple-system`, BlinkMacSystemFont, "Segoe UI", Roboto) for instant mobile rendering.
- **Monospace Tabular**: `JetBrains Mono`, SFMono-Regular, monospace strictly for weights (`kg`), money (`Rp`), and timestamps.

## 4. Touch & Interaction Ergonomics (Emil Kowalski Motion Laws)
- **Minimum Touch Target**: 48px x 48px to prevent miss-clicks with wet/gloved hands.
- **Micro-haptics / Active Feedback**: `scale(0.96)` with `cubic-bezier(0.16, 1, 0.3, 1)` and `120ms` duration.
- **Audio Feedback**: Optional high-frequency synthetic click (`Web Audio API oscillator`) when tapping keypad to confirm input without looking at the screen.
