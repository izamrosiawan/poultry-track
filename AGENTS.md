# SuperDede OS - Agent Directives

Operational guidelines governing agent interactions within superdede-os.

## Core Directives
1. **Dual-Language Routing**: English papers to `en/`; Indonesian skripsi/tesis to `id/`.
2. **Academic Rigor & Anti-Slop**: Formal academic tone, no AI cliches, no buzzwords. Never use em-dashes (U+2014) or en-dashes (U+2013); use ASCII hyphens (-) or commas/parentheses. Verify in-text citations 1-to-1 against BibTeX.
3. **Reproducibility & Anti-Leakage**: Deterministic seed (`seed=42`). Train-test split MUST precede all preprocessing; fit scalers exclusively on `X_train`.
4. **Humanized Flow & Downregulation**: State empirical findings honestly without hyperbole. Vary sentence openings, unpack long clauses, separate empirical facts from normative claims.
5. **Engineering Discipline & TDD**: Simplicity first, surgical diffs, red-to-green TDD tests, systematic debugging with minimal reproductions (no shotgun debugging).
6. **Code Quality**: Vectorized NumPy/Pandas, lean architecture, zero syntax-restating comments, zero ASCII divider banners (`// ---`, `// ===`, `/* === */`). Zero artificial console banners in output (e.g. `System.out.println("=== X ===")`); keep console prints strictly functional, clean, and minimal.
7. **Canonical Architecture**: Default to Signature 5-Repo Canonical Pattern (`notebook.ipynb`, GitHub Pages dashboard, `images/` 300 DPI, `src/`, `sql/`, `tests/`, `requirements.txt`).
8. **Frontend & UI**: Monochrome-first, single accent color, no floating gradient spheres, human copywriting, native system typography.
9. **Domain Skills on Demand**: Consult relevant `.agents/skills/<name>/SKILL.md` workflows autonomously based on domain without explicit user prompting.
10. **Concise Execution**: Direct, self-explanatory code with zero filler prose and minimal token footprint.
11. **Semester 5 Tubes Memory**: Always remember the locked Tugas Besar titles: Manpro is `PoultryTrack` (fixed partner), Tatul/Skripsi is `Deteksi Kerusakan Peti Kemas YOLOv8` (fixed official title), and remaining 5 courses (RSI, PBO, AutoML, ADW, Kemandat) are unified under the Port & Container logistics ecosystem. Never re-ask or lose this context across new chat sessions.
12. **PoultryTrack Stakeholder Formalization**: In all academic documents, project charters, reports, and code artifacts, NEVER refer to the stakeholder as "ibu saya" / family. Exclusively and strictly use the official formal title: **"Pelaku Usaha Mikro / Retailer Unggas Komersial Pasar Tradisional"** (or "Pelaku Usaha / Pengelola Lapak").

