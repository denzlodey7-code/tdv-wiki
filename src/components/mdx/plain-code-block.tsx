"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";

/**
 * Plain code block — for fenced code blocks without a language specifier.
 * Rendered as a monospace scrollable block (not inline code).
 */
export function PlainCodeBlock({ children }: { children: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const codeBg = isDark ? "#0f0f1a" : "#fafafa";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = children.trim();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyButton = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
        isDark
          ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
          : "text-gray-500 hover:bg-black/5 hover:text-gray-700"
      }`}
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-500">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );

  if (!mounted) {
    return (
      <div
        className="my-4 overflow-hidden rounded-lg"
        style={{ border: "1px solid var(--code-border)" }}
        data-expandable
      >
        <div
          className="flex items-center justify-between border-b px-4 py-2.5"
          style={{
            background: "var(--code-header-bg)",
            borderColor: "var(--code-border)",
          }}
        >
          <span
            className="font-mono text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            terminal
          </span>
          <div className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400">
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </div>
        </div>
        <div
          className="overflow-x-auto p-4 font-mono text-[var(--text-sm)] leading-[var(--leading-body)] whitespace-pre"
          style={{ background: "var(--code-bg)", color: "var(--foreground)" }}
        >
          {children.trim()}
        </div>
      </div>
    );
  }

  return (
    <div
      className="my-4 overflow-hidden rounded-lg"
      style={{ border: `1px solid ${borderColor}` }}
      data-expandable
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{
          background: isDark ? "#15151f" : "#f0f0f0",
          borderColor: borderColor,
        }}
      >
        <span
          className={`font-mono text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          terminal
        </span>
        {copyButton}
      </div>
      <div
        className="overflow-x-auto p-4 font-mono text-[var(--text-sm)] leading-[var(--leading-body)] whitespace-pre"
        style={{
          background: codeBg,
          color: isDark ? "#e5e5e5" : "#333",
        }}
      >
        {children.trim()}
      </div>
    </div>
  );
}
