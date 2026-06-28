"use client";

import React from "react";
import Link from "next/link";
import { SearchButton } from "./search-dialog";
import ThemeToggle from "./theme-toggle";
import { Menu, X, ExternalLink, Plus } from "lucide-react";

interface HeaderProps {
  onSearchOpen: () => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  currentSlug?: string;
  currentSection?: string;
  tabs: { title: string; firstSlug: string }[];
  canEdit?: boolean;
  version?: string;
}

export default function Header({
  onSearchOpen,
  onMobileMenuToggle,
  isMobileMenuOpen,
  currentSlug,
  currentSection,
  tabs,
  canEdit = true,
  version,
}: HeaderProps) {
  const activeTabStyle =
    "px-3 py-1 text-[14px] font-medium text-foreground bg-muted rounded-full whitespace-nowrap";
  const inactiveTabStyle =
    "px-3 py-1 text-[14px] font-medium text-muted-foreground hover:text-foreground bg-transparent rounded-full hover:bg-muted transition-colors whitespace-nowrap";

  return (
    <header className="border-border bg-background sticky top-0 z-30 flex h-[49px] items-center border-b">
      <div className="flex w-full items-center gap-4 px-4">
        {/* Left: Hamburger + Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="hover:bg-muted -ml-1.5 rounded-md p-1.5 transition-colors xl:hidden"
            aria-label="Navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="text-muted-foreground h-5 w-5" />
            ) : (
              <Menu className="text-muted-foreground h-5 w-5" />
            )}
          </button>

          <Link href="/docs/" className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-foreground"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-foreground font-semibold text-[var(--text-md)]">
              StsDev Wiki
            </span>
          </Link>
        </div>

        {/* Tabs — scrollable on overflow */}
        <nav className="docs-show-md-flex ml-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentSection === tab.title;
            return (
              <Link
                key={tab.title}
                href={`/docs/${tab.firstSlug}/`}
                className={isActive ? activeTabStyle : inactiveTabStyle}
              >
                {tab.title}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {canEdit && (
            <Link
              href="/docs/new/"
              className="docs-show-sm-flex text-muted-foreground hover:text-foreground hover:bg-muted items-center gap-1 rounded-md px-2.5 py-1.5 text-[var(--text-sm)] transition-colors"
              title="Create page"
            >
              <Plus className="h-4 w-4" />
              <span className="docs-show-lg-inline">Create</span>
            </Link>
          )}

          {canEdit && currentSlug && (
            <Link
              href={`/docs/${currentSlug}/edit/`}
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[var(--text-sm)] transition-colors"
              title="Edit this page"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              <span className="docs-show-lg-inline">Edit</span>
            </Link>
          )}

          <ThemeToggle />
          <SearchButton onClick={onSearchOpen} />

          <a
            href="https://github.com/stsgs1980/StsDev-Wiki-Template"
            target="_blank"
            rel="noopener noreferrer"
            className="docs-show-sm-flex bg-foreground text-background hover:bg-foreground/90 items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-[var(--text-sm)] transition-colors"
          >
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>

          {version && (
            <span className="docs-show-md-inline-flex text-muted-foreground/60 border-border items-center rounded-md border px-2 py-1 font-mono text-[11px] select-none">
              v{version}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}