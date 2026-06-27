"use client";

import React from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  children,
}: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 xl:hidden"
        onClick={onClose}
      />
      <aside className="bg-sidebar fixed top-0 left-0 z-50 h-full w-[280px] shadow-2xl xl:hidden">
        <div className="border-border flex h-[49px] items-center gap-2 border-b px-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-foreground shrink-0"
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
          <span className="text-foreground text-sm font-medium">
            StsDev Wiki
          </span>
        </div>
        {children}
      </aside>
    </>
  );
}
