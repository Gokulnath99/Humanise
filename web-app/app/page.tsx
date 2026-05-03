"use client";

import { useState } from "react";

type HumaniseMode = "subtle" | "casual" | "executive";

const MODES: { key: HumaniseMode; label: string; description: string }[] = [
  { key: "subtle", label: "Subtle", description: "Light polish, keeps structure" },
  { key: "casual", label: "Casual", description: "Like texting a friend" },
  { key: "executive", label: "Executive", description: "Confident, direct, professional" },
];


export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modeIndex, setModeIndex] = useState(1); // Default to "Natural" (middle)
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMode = MODES[modeIndex];

  const handleHumanise = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");

    try {
      const response = await fetch("/api/humanise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode: currentMode.key }),
      });

      const data = await response.json();

      if (data.error) {
        setOutputText(`Error: ${data.error}`);
      } else {
        setOutputText(data.humanisedText);
      }
    } catch (error) {
      setOutputText("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2">Humanise</h1>
        <p className="text-gray-400 text-center mb-8">
          Transform AI-generated text into natural, human writing
        </p>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Paste your text
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste AI-generated text here..."
            className="w-full h-40 p-4 bg-gray-900 border border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       resize-none text-gray-100 placeholder-gray-500"
          />
        </div>

        {/* Mode Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Style: <span className="text-blue-400">{currentMode.label}</span>
          </label>
          
          {/* Slider */}
          <input
            type="range"
            min="0"
            max="2"
            value={modeIndex}
            onChange={(e) => setModeIndex(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                       accent-blue-500"
          />
          
          {/* Labels */}
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            {MODES.map((m, i) => (
              <span
                key={m.key}
                className={modeIndex === i ? "text-blue-400 font-medium" : ""}
              >
                {m.label}
              </span>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-500 mt-2 text-center">
            {currentMode.description}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleHumanise}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 
                     disabled:cursor-not-allowed rounded-lg font-medium 
                     transition-colors mb-6"
        >
          {isLoading ? "Humanising..." : "Humanise"}
        </button>

        {/* Output */}
        {outputText && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Humanised output
              </label>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700
                           rounded-md transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="w-full min-h-40 p-4 bg-gray-900 border border-gray-700
                           rounded-lg text-gray-100 whitespace-pre-wrap">
              {outputText}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
