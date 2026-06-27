"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="hover:bg-muted rounded-lg p-2 transition-colors"
        aria-label="Переключить тему"
      >
        <Sun className="text-muted-foreground h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hover:bg-muted rounded-lg p-2 transition-colors"
      aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    >
      {theme === "dark" ? (
        <Sun className="text-muted-foreground h-4 w-4" />
      ) : (
        <Moon className="text-muted-foreground h-4 w-4" />
      )}
    </button>
  );
}
