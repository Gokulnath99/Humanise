"use client";

const MAX = 10000;

export function Composer({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const overLimit = value.length > MAX * 0.9;
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <div className="flex items-center justify-between">
        <span className="eyebrow">before</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em" }}>
          <span style={{ color: overLimit ? "var(--ink-400)" : "var(--fg-2)" }}>
            {value.length.toLocaleString()}
          </span>
          <span style={{ color: "var(--fg-3)" }}> / {MAX.toLocaleString()}</span>
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="paste AI-generated text…"
        maxLength={MAX}
        style={{
          width: "100%",
          minHeight: 160,
          background: "var(--bg-2)",
          border: "0.5px solid var(--border-default)",
          padding: "12px 14px",
          color: "var(--fg-0)",
          fontFamily: "var(--font-display)",
          fontSize: 15,
          lineHeight: 1.6,
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
          transition: "border-color 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}
