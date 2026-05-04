"use client";

import type { ModeConfig } from "@/app/types";

interface ModeSliderProps {
  modes: ModeConfig[];
  currentIndex: number;
  onChange: (index: number) => void;
}

export function ModeSlider({ modes, currentIndex, onChange }: ModeSliderProps) {
  const currentMode = modes[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Writing Style
        </label>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {currentMode.icon} {currentMode.label}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max={modes.length - 1}
        value={currentIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-blue-600
                   [&::-webkit-slider-thumb]:dark:bg-blue-500
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:transition-transform
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-blue-600
                   [&::-moz-range-thumb]:dark:bg-blue-500
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:shadow-md"
      />

      <div className="flex justify-between">
        {modes.map((mode, i) => (
          <button
            key={mode.key}
            onClick={() => onChange(i)}
            className={`text-xs font-medium transition-colors ${
              currentIndex === i
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg py-2 px-3">
        {currentMode.description}
      </p>
    </div>
  );
}
