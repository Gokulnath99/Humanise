"use client";

import { TextareaHTMLAttributes, forwardRef, ChangeEvent } from "react";

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = "", label, error, charCount, maxChars, onChange, ...props }, ref) => {
    const baseStyles = `
      w-full rounded-xl border bg-transparent px-4 py-3 text-base
      transition-all duration-200 resize-none
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const borderStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 dark:border-gray-700";

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            {maxChars && (
              <span className={`text-xs ${charCount && charCount > maxChars ? "text-red-500" : "text-gray-400"}`}>
                {charCount?.toLocaleString() || 0} / {maxChars.toLocaleString()}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          className={`${baseStyles} ${borderStyles} ${className}`}
          onChange={onChange}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
