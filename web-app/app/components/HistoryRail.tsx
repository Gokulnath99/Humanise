"use client";

import { MODES, type HumaniseMode } from "./LevelSlider";
import { formatRelativeTime } from "./providers/useHistory";

export type HistoryItem = { id: string; timestamp: number; mode: HumaniseMode; preview: string, input: string; output: string };

export function HistoryRail({
  items,
  activeId,
  onSelect,
}: {
  items: HistoryItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      className="flex flex-col"
      style={{
        width: 220,
        borderRight: "0.5px solid var(--border-default)",
        padding: "16px 0",
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 16px" }}>
        <span className="eyebrow">recent</span>
      </div>
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const lvl = MODES.find((m) => m.key === item.mode)!;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex flex-col text-left"
              style={{
                gap: 4,
                padding: "10px 14px",
                border: "none",
                background: isActive ? "var(--bg-2)" : "transparent",
                borderLeft: isActive ? "2px solid var(--ink-400)" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                transition: "background 200ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: "var(--fg-2)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: lvl.color }} />
                <span
                  className="scribe-italic"
                  style={{ fontSize: 11, color: "var(--fg-2)", whiteSpace: "nowrap", marginLeft: "auto" }}
                >
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "var(--fg-1)",
                  lineHeight: 1.45,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.preview}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
