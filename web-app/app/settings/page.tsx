"use client";

import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { useSettings } from "../components/providers/SettingsProvider";
import type { EmDashMode } from "../types";

const EM_DASH_OPTIONS: { key: EmDashMode; label: string; desc: string }[] = [
  { key: "limit",   label: "limit to two",       desc: "keep some for natural flow" },
  { key: "remove",  label: "remove all",         desc: "strip every em-dash" },
  { key: "replace", label: "replace with comma", desc: "convert — to , for safety" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100vh", background: "var(--bg-1)" }}
    >
      <Header onNew={() => router.push("/")} />

      <main
        className="flex justify-center"
        style={{ flex: 1, padding: "28px 40px 48px" }}
      >
        <div
          className="flex flex-col w-full"
          style={{ maxWidth: 640, gap: 32 }}
        >
          <header className="flex flex-col" style={{ gap: 6 }}>
            <span className="eyebrow">settings</span>
            <h1
              className="scribe-italic"
              style={{
                fontSize: 28,
                color: "var(--fg-0)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              configure how the scribe writes
            </h1>
          </header>

          <section className="flex flex-col" style={{ gap: 10 }}>
            <div
              className="flex items-baseline justify-between"
              style={{ gap: 12 }}
            >
              <span className="eyebrow">em-dash</span>
              <span
                className="scribe-italic"
                style={{ fontSize: 12, color: "var(--fg-2)" }}
              >
                — detectors notice their overuse
              </span>
            </div>
            <div
              className="flex flex-col"
              style={{ borderTop: "0.5px solid var(--border-default)" }}
            >
              {EM_DASH_OPTIONS.map((option) => {
                const active = settings.emDashMode === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => updateSettings({ emDashMode: option.key })}
                    className="flex items-baseline justify-between text-left"
                    style={{
                      gap: 16,
                      padding: "14px 0",
                      background: "transparent",
                      border: "none",
                      borderBottom: "0.5px solid var(--border-default)",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="flex items-baseline"
                      style={{ gap: 10, flex: 1 }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: active ? "var(--ink-400)" : "transparent",
                          border: `1px solid ${active ? "var(--ink-400)" : "var(--border-strong)"}`,
                          flexShrink: 0,
                          transform: "translateY(-1px)",
                        }}
                      />
                      <span
                        className="scribe-italic"
                        style={{
                          fontSize: 16,
                          color: active ? "var(--ink-400)" : "var(--fg-1)",
                          borderBottom: active
                            ? "1px solid var(--ink-400)"
                            : "1px solid transparent",
                          paddingBottom: 1,
                          transition: "color 200ms, border-color 200ms",
                        }}
                      >
                        {option.label}
                      </span>
                    </span>
                    <span
                      className="scribe-italic"
                      style={{
                        fontSize: 13,
                        color: "var(--fg-2)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {option.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="flex flex-col"
            style={{
              gap: 8,
              padding: "16px 18px",
              background: "var(--bg-2)",
              border: "0.5px solid var(--border-default)",
            }}
          >
            <span className="eyebrow">why this matters</span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                lineHeight: 1.65,
                color: "var(--fg-1)",
                margin: 0,
              }}
            >
              ai models lean on em-dashes as a tic. detectors have learned the
              pattern. limiting them helps the prose pass for human-written.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
