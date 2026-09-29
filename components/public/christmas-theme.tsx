"use client"

import { Great_Vibes } from "next/font/google"

export const christmasScript = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" })

export const XMAS = {
  burgundy: "#5c0f1a",
  burgundyDeep: "#3f0a12",
  green: "#0f3b2e",
  greenDeep: "#082a20",
  cream: "#f7edd8",
  gold: "#e3b458",
  goldLight: "#f6dfa4",
}

/* One-off keyframes shared by every festive component */
export function ChristmasStyles() {
  return (
    <style jsx global>{`
      @keyframes xmas-snow {
        0% { transform: translate3d(var(--sx, 0), -10vh, 0) rotate(0deg); }
        100% { transform: translate3d(calc(var(--sx, 0) + var(--drift, 0px)), 110vh, 0) rotate(360deg); }
      }
      @keyframes xmas-twinkle {
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 14px currentColor); }
        50% { opacity: 0.35; filter: drop-shadow(0 0 1px currentColor); }
      }
      @keyframes xmas-shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes xmas-sway {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes xmas-glow {
        0%, 100% { box-shadow: 0 0 24px rgba(227,180,88,0.35), 0 0 60px rgba(227,180,88,0.15); }
        50% { box-shadow: 0 0 40px rgba(227,180,88,0.6), 0 0 90px rgba(227,180,88,0.25); }
      }
      .xmas-snowflake { position: absolute; top: 0; color: #fff; pointer-events: none; will-change: transform; animation: xmas-snow linear infinite; }
      .xmas-bulb { animation: xmas-twinkle 2.4s ease-in-out infinite; }
      .xmas-gold-text {
        background: linear-gradient(100deg, #b8862e 0%, #f6dfa4 25%, #e3b458 50%, #fff2c8 70%, #b8862e 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: xmas-shimmer 6s linear infinite;
        /* Script glyphs (esp. the capital C) rise well above the em box; with
           background-clip:text anything outside the box is clipped, so pad it. */
        line-height: 1.35;
        padding: 0.18em 0.2em 0.12em;
        margin: -0.1em -0.2em -0.05em;
        display: inline-block;
        max-width: 100%;
      }
      .xmas-sway { transform-origin: top center; animation: xmas-sway 4s ease-in-out infinite; }
      .xmas-glow { animation: xmas-glow 3s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .xmas-snowflake, .xmas-bulb, .xmas-gold-text, .xmas-sway, .xmas-glow { animation: none !important; }
      }
    `}</style>
  )
}

/* Gentle snowfall — deterministic positions so SSR and client agree */
export function Snowfall({ count = 44, className = "" }: { count?: number; className?: string }) {
  const flakes = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280
    const r = seed / 233280
    const left = (i / count) * 100 + (r - 0.5) * 4
    const size = 3 + ((i * 7) % 6)
    const duration = 9 + ((i * 13) % 11)
    const delay = -((i * 3.7) % duration)
    const drift = ((i % 5) - 2) * 30
    const opacity = 0.35 + ((i * 11) % 6) / 10
    return { left, size, duration, delay, drift, opacity }
  })
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="xmas-snowflake rounded-full"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--drift" as string]: `${f.drift}px`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  )
}

/* String of fairy lights drooping across the top */
export function FairyLights({ count = 14, className = "" }: { count?: number; className?: string }) {
  const colours = ["#f6dfa4", "#ff6b6b", "#7bd88f", "#e3b458", "#7fc8ff", "#ff9ecb"]
  const step = 100 / (count + 1)
  return (
    <div className={`absolute left-0 right-0 top-0 h-20 pointer-events-none ${className}`} aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 80" preserveAspectRatio="none">
        <path d="M0 8 Q 250 60 500 22 T 1000 8" fill="none" stroke="#1a1a1a" strokeWidth="2" opacity="0.7" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const x = step * (i + 1)
        // approximate the curve height at x (0..1000 -> 0..100)
        const t = x / 100
        const y = 8 + 26 * Math.sin(Math.PI * t) + (t > 0.5 ? 0 : 6 * Math.sin(Math.PI * t * 2)) // rough droop
        return (
          <span
            key={i}
            className="absolute -translate-x-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="block w-[3px] h-2 bg-neutral-800 mx-auto rounded-sm" />
            <span
              className="xmas-bulb block w-3 h-4 rounded-full"
              style={{ backgroundColor: colours[i % colours.length], color: colours[i % colours.length], animationDelay: `${(i * 0.37) % 2.4}s` }}
            />
          </span>
        )
      })}
    </div>
  )
}

/* Holly sprig — two leaves and three berries */
export function Holly({ className = "", size = 56 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M30 34 C18 34 10 26 8 14 C20 12 30 18 32 30 Z" fill="#1f6b45" stroke="#0f3b2e" strokeWidth="1.5" />
      <path d="M34 34 C46 34 54 26 56 14 C44 12 34 18 32 30 Z" fill="#2a8555" stroke="#0f3b2e" strokeWidth="1.5" />
      <path d="M8 14 L32 30 M56 14 L32 30" stroke="#0f3b2e" strokeWidth="1" opacity="0.6" />
      <circle cx="27" cy="38" r="4.5" fill="#c1121f" stroke="#7a0b14" />
      <circle cx="36" cy="40" r="4.5" fill="#d7263d" stroke="#7a0b14" />
      <circle cx="31" cy="46" r="4.5" fill="#b3101c" stroke="#7a0b14" />
      <circle cx="26" cy="36.5" r="1.2" fill="#fff" opacity="0.7" />
      <circle cx="35" cy="38.5" r="1.2" fill="#fff" opacity="0.7" />
    </svg>
  )
}

/* Hanging bauble */
export function Bauble({ colour = "#c1121f", className = "", size = 40, delay = 0 }: { colour?: string; className?: string; size?: number; delay?: number }) {
  return (
    <div className={`xmas-sway ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden>
      <svg width={size} height={size * 1.4} viewBox="0 0 40 56">
        <line x1="20" y1="0" x2="20" y2="10" stroke="#e3b458" strokeWidth="1.5" />
        <rect x="15" y="9" width="10" height="6" rx="1.5" fill="#e3b458" />
        <circle cx="20" cy="34" r="19" fill={colour} />
        <path d="M2 30 Q20 22 38 30" stroke="#f6dfa4" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M2 38 Q20 46 38 38" stroke="#f6dfa4" strokeWidth="1.2" fill="none" opacity="0.6" />
        <ellipse cx="13" cy="26" rx="4" ry="6" fill="#fff" opacity="0.28" />
      </svg>
    </div>
  )
}

/* Gold divider with a star */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#e3b458]" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#e3b458"><path d="M12 2l2.4 6.6L21 9.3l-5 4.4L17.5 21 12 17.4 6.5 21 8 13.7l-5-4.4 6.6-.7z" /></svg>
      <div className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#e3b458]" />
    </div>
  )
}
