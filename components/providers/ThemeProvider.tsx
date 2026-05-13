"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// ── Keep these in sync with globals.css ──────────────────────────────────────
const THEME_BG_CARD:  Record<Theme, string> = { dark: "#130D0D", light: "#FFF9F7" };
const THEME_BORDER:   Record<Theme, string> = {
  dark:  "rgba(230, 140, 160, 0.13)",
  light: "rgba(208, 77, 106, 0.20)",
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolved = saved ?? preferred;
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved === "light" ? "light" : "");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Prevent double-trigger while a cascade is still running
    if (document.querySelector("[data-card-cascade]")) return;

    const next: Theme = theme === "dark" ? "light" : "dark";

    // ── 1. Sort every card top-to-bottom (visible cards first) ────
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".card-base"));
    const viewH = window.innerHeight;
    cards.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const aVis = ar.bottom > 0 && ar.top < viewH;
      const bVis = br.bottom > 0 && br.top < viewH;
      if (aVis && !bVis) return -1;
      if (!aVis && bVis) return 1;
      return ar.top - br.top;
    });

    // ── 2. Snapshot each card's current colors and inject overlay ──
    //
    //  Stacking order within the card (once card-cascade-live class
    //  is applied, making the card a stacking context with bg = transparent):
    //
    //    z = -1  │  overlay  — old color → new color (crossfades behind content)
    //    z = auto│  card content (text, icons, etc.)  ← always visible
    //
    //  The !important transparent bg on .card-cascade-live means React's
    //  inline background: var(--bg-card) is suppressed for the duration,
    //  so only the overlay is the visible background.

    const nextBgCard = THEME_BG_CARD[next];
    const nextBorder = THEME_BORDER[next];

    type OverlayEntry = { card: HTMLElement; overlay: HTMLElement };
    const entries: OverlayEntry[] = [];

    cards.forEach((card, i) => {
      const cs     = getComputedStyle(card);
      const oldBg  = cs.backgroundColor;
      const oldBd  = cs.borderColor;
      const br     = cs.borderRadius || "6px";
      const delay  = Math.min(i, 16) * 55; // 55 ms per card, capped at card #16

      const overlay = document.createElement("div");
      overlay.setAttribute("data-card-cascade", "");
      overlay.style.cssText = `
        position: absolute;
        inset: -1px;
        background: ${oldBg};
        border: 1px solid ${oldBd};
        border-radius: ${br};
        pointer-events: none;
        z-index: -1;
        opacity: 1;
      `;

      // Promote card to stacking context (transparent bg via CSS class)
      card.classList.add("card-cascade-live");
      card.appendChild(overlay);
      entries.push({ card, overlay });

      // Stagger the crossfade after theme swap (set in rAF below)
      overlay.dataset.delay = String(delay);
    });

    // ── 3. Swap the theme ─────────────────────────────────────────
    // @property transitions animate all other elements (text, nav,
    // footer, page bg) in real time. Cards are "frozen" by overlays.
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next === "light" ? "light" : "");

    // ── 4. Two frames later: cascade-crossfade overlays to new color
    // Two rAFs ensure the browser has painted the new theme under the
    // overlays before we start transitioning them.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entries.forEach(({ overlay }) => {
          const delay = Number(overlay.dataset.delay ?? 0);
          overlay.style.transition =
            `background-color 0.55s ease ${delay}ms, border-color 0.55s ease ${delay}ms`;
          overlay.style.background  = nextBgCard;
          overlay.style.borderColor = nextBorder;
        });
      });
    });

    // ── 5. Clean up after every overlay has finished ──────────────
    const totalMs = Math.min(entries.length, 17) * 55 + 650;
    setTimeout(() => {
      entries.forEach(({ card, overlay }) => {
        overlay.remove();
        card.classList.remove("card-cascade-live");
      });
    }, totalMs);
  };

  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
