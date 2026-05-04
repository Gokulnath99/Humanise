// Marginalium — the brand drop, inline SVG so it tints with --ink-400.
export function Marginalium({ size = 14 }: { size?: number }) {
  const w = (size * 24) / 32;
  return (
    <svg viewBox="0 0 24 32" width={w} height={size} aria-hidden style={{ display: "block" }}>
      <path d="M 12 4 Q 4 18, 12 28 Q 20 18, 12 4 Z" fill="var(--ink-400)" />
      <circle cx="12" cy="20" r="2.4" fill="var(--bg-1)" opacity="0.85" />
    </svg>
  );
}

// Wordmark — humani(s)e, with the s italic-underlined ochre.
export function Wordmark({ size = 17 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size,
        letterSpacing: "-0.01em",
        color: "var(--fg-0)",
        lineHeight: 1,
      }}
    >
      humani
      <span
        style={{
          fontStyle: "italic",
          color: "var(--ink-400)",
          borderBottom: "1px solid var(--ink-400)",
          paddingBottom: 1,
        }}
      >
        s
      </span>
      e
    </span>
  );
}
