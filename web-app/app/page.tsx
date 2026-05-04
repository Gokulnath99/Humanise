"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Composer } from "./components/Composer";
import { LevelSlider, MODES, type HumaniseMode } from "./components/LevelSlider";
import { OutputPanel } from "./components/OutputPanel";
import { HistoryRail, type HistoryItem } from "./components/HistoryRail";
import { useSettings } from "./components/providers/SettingsProvider";
import { useHistory } from "./components/providers/useHistory";
import { useToast } from "./components/ui";

const TYPEWRITER_TICK_MS = 30;
const CHARS_PER_TICK = 2;

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [modeIndex, setModeIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { history, addEntry, removeEntry } = useHistory();
  const [activeHistory, setActiveHistory] = useState<string | null>(null);
  const { settings } = useSettings();
  const { showToast, ToastContainer } = useToast();

  const bufferRef = useRef("");
  const fullOutputRef = useRef("");
  const streamDoneRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mode: HumaniseMode = MODES[modeIndex].key;
  const canRun = input.trim().length > 0 && !isLoading;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopTypewriter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stopTypewriter();
    bufferRef.current = "";
    streamDoneRef.current = true;
    setInput("");
    setOutput("");
    setIsLoading(false);
  };

  const handleHumanise = async () => {
    if (!canRun) return;
    stopTypewriter();
    bufferRef.current = "";
    fullOutputRef.current = "";
    streamDoneRef.current = false;
    setIsLoading(true);
    setOutput("");

    intervalRef.current = setInterval(() => {
      if (bufferRef.current.length === 0) {
        if (streamDoneRef.current) {
          stopTypewriter();
          setIsLoading(false);

          if (fullOutputRef.current.trim()) {
            const newId = addEntry({
              mode,
              input,
              output: fullOutputRef.current,
            });
            setActiveHistory(newId);
          }
        }
        return;
      }
      const reveal = bufferRef.current.slice(0, CHARS_PER_TICK);
      bufferRef.current = bufferRef.current.slice(CHARS_PER_TICK);
      setOutput((prev) => prev + reveal);
    }, TYPEWRITER_TICK_MS);

    try {
      const response = await fetch("/api/humanise/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          mode,
          emDashMode: settings.emDashMode,
        }),
      });

      if (!response.ok) throw new Error("Failed to humanise");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        bufferRef.current += chunk;
        fullOutputRef.current += chunk;
      }
      streamDoneRef.current = true;
    } catch {
      streamDoneRef.current = true;
      stopTypewriter();
      setIsLoading(false);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleHistorySelect = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (!item) return;

    stopTypewriter();
    bufferRef.current = "";
    streamDoneRef.current = true;
    setIsLoading(false);

    setInput(item.input);
    setOutput(item.output);
    setActiveHistory(id);

    const idx = MODES.findIndex((m) => m.key === item.mode);
    if (idx !== -1) setModeIndex(idx);
  };


  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: "100vh",
        background: "var(--bg-1)",
      }}
    >
      <Header onNew={reset} />

      <div className="flex" style={{ flex: 1, minHeight: 0 }}>
        <HistoryRail
          items={history}                          
          activeId={activeHistory ?? ""}           
          onSelect={handleHistorySelect}           
        />


        <main
          className="flex justify-center"
          style={{ flex: 1, padding: "28px 40px 48px" }}
        >
          <div
            className="flex flex-col w-full"
            style={{ maxWidth: 640, gap: 20 }}
          >
            <Composer value={input} onChange={setInput} />
            <LevelSlider index={modeIndex} onChange={setModeIndex} />

            <button
              onClick={handleHumanise}
              disabled={!canRun}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: canRun ? "var(--ink-400)" : "transparent",
                color: canRun ? "#0e0c08" : "var(--fg-3)",
                border: `0.5px solid ${canRun ? "var(--ink-400)" : "var(--border-default)"}`,
                fontFamily: "var(--font-display)",
                fontSize: 15,
                letterSpacing: "0.02em",
                cursor: canRun ? "pointer" : "not-allowed",
                transition: "all 240ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {isLoading ? "humanising…" : "humanise"}
            </button>

            {(output || isLoading) && (
              <OutputPanel
                before={input}
                after={output}
                mode={mode}
                isStreaming={isLoading}
              />
            )}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}