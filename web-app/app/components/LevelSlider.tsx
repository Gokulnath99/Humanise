"use client";

import React from "react";

export type HumaniseMode = "subtle" | "casual" | "executive";

export const MODES: { key: HumaniseMode; label: string; color: string; desc: string }[] = [
  { key: "subtle",    label: "subtle",    color: "var(--level-subtle)",  desc: "a light polish" },
  { key: "casual",    label: "casual",    color: "var(--level-natural)", desc: "like texting a friend" },
  { key: "executive", label: "executive", color: "var(--level-casual)",  desc: "confident, direct" },
];

export function LevelSlider({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const active = MODES[index];
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
        <span className="eyebrow">level</span>
        <span className="scribe-italic" style={{ fontSize: 12, color: "var(--fg-2)", whiteSpace: "nowrap" }}>
          — {active.desc}
        </span>
      </div>
      <div
        className="flex items-center"
        style={{
          gap: 10,
          padding: "8px 0",
          borderTop: "0.5px solid var(--border-default)",
          borderBottom: "0.5px solid var(--border-default)",
        }}
      >
        {MODES.map((m, i) => (
          <React.Fragment key={m.key}>
            <button
              onClick={() => onChange(i)}
              className="scribe-italic"
              style={{
                background: "transparent",
                border: "none",
                fontSize: 14,
                padding: "1px 0",
                cursor: "pointer",
                color: i === index ? m.color : "var(--fg-2)",
                borderBottom: i === index ? `1px solid ${m.color}` : "1px solid transparent",
                transition: "color 200ms, border-color 200ms",
              }}
            >
              {m.label}
            </button>
            {i < MODES.length - 1 && (
              <span style={{ color: "var(--fg-3)", fontFamily: "var(--font-display)" }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
