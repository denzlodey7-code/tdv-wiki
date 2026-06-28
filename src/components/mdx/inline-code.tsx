"use client";

import React from "react";

/**
 * Inline code component — for single-line code snippets within paragraphs.
 * Example: `const x = 1`
 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted text-foreground/90 rounded px-1.5 py-0.5 font-mono text-[var(--text-sm)]">
      {children}
    </code>
  );
}
