"use client";

import { useState } from "react";
import { MODES, type HumaniseMode } from "./LevelSlider";

export function OutputPanel({
  before,
  after,
  mode,
  isStreaming,
}: {
  before: string;
  after: string;
  mode: HumaniseMode;
  isStreaming: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"after" | "split">("after");
  const lvl = MODES.find((m) => m.key === mode)!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(after);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 12 }}>
          <span className="eyebrow">after</span>
          <span
            className="scribe-italic"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: lvl.color }}
          >
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: lvl.color }} />
            <span style={{ borderBottom: "1px solid", paddingBottom: 1, borderColor: lvl.color }}>{lvl.label}</span>
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <button
            onClick={() => setView((v) => (v === "after" ? "split" : "after"))}
            className="scribe-italic"
            style={{ background: "transparent", border: "none", color: "var(--fg-1)", fontSize: 12, padding: "4px 8px", cursor: "pointer" }}
          >
            {view === "after" ? "compare" : "result"}
          </button>
          <button
            onClick={handleCopy}
            style={{
              background: "transparent",
              color: "var(--fg-0)",
              border: "0.5px solid var(--border-default)",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              letterSpacing: "0.02em",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>

      {view === "after" ? (
        <Panel>
          {after}
          {isStreaming && <StreamingCursor />}
        </Panel>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "0.5px solid var(--border-default)" }}>
          <Panel style={{ color: "var(--fg-1)", borderRight: "0.5px solid var(--border-default)", border: "none" }}>
            <PanelLabel>before</PanelLabel>
            <div>{before}</div>
          </Panel>
          <Panel style={{ border: "none" }}>
            <PanelLabel style={{ color: "var(--ink-400)" }}>after — {lvl.label}</PanelLabel>
            <div>
              {after}
              {isStreaming && <StreamingCursor />}
            </div>
          </Panel>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-2)",
        }}
      >
        <span>{after.length.toLocaleString()} chars</span>
      </div>
    </div>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "0.5px solid var(--border-default)",
        padding: "14px 16px",
        color: "var(--fg-0)",
        fontFamily: "var(--font-display)",
        fontSize: 15,
        lineHeight: 1.65,
        whiteSpace: "pre-wrap",
        minHeight: 100,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PanelLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="eyebrow"
      style={{ color: "var(--fg-2)", marginBottom: 8, fontSize: 9, ...style }}
    >
      {children}
    </div>
  );
}

function StreamingCursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.05em",
        background: "var(--ink-400)",
        marginLeft: 2,
        verticalAlign: "text-bottom",
        animation: "pulse 1s ease-in-out infinite",
      }}
    />
  );
}
