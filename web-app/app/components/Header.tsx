"use client";

import Link from "next/link";
import { Marginalium, Wordmark } from "./Brand";

export function Header({ onNew }: { onNew: () => void }) {
  return (
    <header
      className="flex items-center justify-between sticky top-0 z-10"
      style={{
        padding: "10px 20px",
        borderBottom: "0.5px solid var(--border-default)",
        background: "transparent",
      }}
    >
      <Link
        href="/"
        className="flex items-center"
        style={{ gap: 10, textDecoration: "none" }}
      >
        <Marginalium size={32} />
        <Wordmark size={30} />
      </Link>
      <nav className="flex items-center" style={{ gap: 18 }}>
        <button
          className="eyebrow"
          style={{
            background: "transparent",
            border: "none",
            padding: "6px 0",
            cursor: "pointer",
            color: "var(--fg-1)",
          }}
        >
          history
        </button>
        <Link
          href="/settings"
          className="eyebrow"
          style={{
            padding: "6px 0",
            color: "var(--fg-1)",
            textDecoration: "none",
          }}
        >
          settings
        </Link>
        <button
          onClick={onNew}
          className="scribe-italic"
          style={{
            background: "transparent",
            color: "var(--ink-400)",
            border: "0.5px solid var(--ink-400)",
            fontSize: 13,
            padding: "5px 12px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            marginLeft: 4,
          }}
        >
          new page
        </button>
      </nav>
    </header>
  );
}