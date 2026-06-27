"use client";

import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  FolderPlus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { NavSection } from "@/lib/mdx-utils";

interface SidebarNavProps {
  navigation: NavSection[];
  currentSlug: string;
  openSections: Set<string>;
  canEdit: boolean;
  onToggleSection: (title: string) => void;
  onNavigate: (slug: string) => void;
  onDelete: (slug: string, title: string) => void;
  onMoveSection: (sectionTitle: string, direction: "up" | "down") => void;
  onCreateInSection: (sectionTitle: string) => void;
  onNewSectionClick: () => void;
  moving: string | null;
}

export default function SidebarNav({
  navigation,
  currentSlug,
  openSections,
  canEdit,
  onToggleSection,
  onNavigate,
  onDelete,
  onMoveSection,
  onCreateInSection,
  onNewSectionClick,
  moving,
}: SidebarNavProps) {
  return (
    <nav className="flex h-full flex-col">
      <div className="flex-1 scrollbar-thin overflow-y-auto px-3 py-4">
        {navigation.map((section, sectionIdx) => {
          const isSectionOpen = openSections.has(section.title);
          const isActive = section.items.some((i) => i.slug === currentSlug);

          return (
            <div key={section.title} className="mb-1">
              <div className="flex items-center">
                <button
                  onClick={() => onToggleSection(section.title)}
                  className={`flex min-w-0 flex-1 items-center rounded-md px-2 py-1.5 text-left font-medium text-[var(--text-sm)] transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  {isSectionOpen ? (
                    <ChevronDown className="mr-1.5 h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="mr-1.5 h-3 w-3 shrink-0" />
                  )}
                  <span className="break-words">{section.title}</span>
                </button>
                {canEdit && (
                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() => onMoveSection(section.title, "up")}
                      disabled={sectionIdx === 0 || moving === section.title}
                      className="text-muted-foreground/0 hover:text-muted-foreground hover:bg-muted/50 disabled:hover:text-muted-foreground/0 rounded p-0.5 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Секцию выше"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onMoveSection(section.title, "down")}
                      disabled={
                        sectionIdx === navigation.length - 1 ||
                        moving === section.title
                      }
                      className="text-muted-foreground/0 hover:text-muted-foreground hover:bg-muted/50 disabled:hover:text-muted-foreground/0 rounded p-0.5 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Секцию ниже"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onCreateInSection(section.title)}
                      className="text-muted-foreground/0 hover:text-muted-foreground hover:bg-muted/50 rounded p-1 transition-colors"
                      title={`Добавить страницу в "${section.title}"`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {isSectionOpen && (
                <div className="mt-0.5 ml-4 space-y-0.5">
                  {section.items.map((item) => (
                    <div
                      key={item.slug}
                      className="group/item flex items-center"
                    >
                      <button
                        onClick={() => onNavigate(item.slug)}
                        className={`min-w-0 flex-1 rounded-md px-2.5 py-1.5 text-left break-words text-[var(--text-sm)] transition-all ${
                          currentSlug === item.slug
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span className="break-words">{item.title}</span>
                      </button>
                      {canEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.slug, item.title);
                          }}
                          className="text-muted-foreground/0 group-hover/item:text-muted-foreground/60 mr-0.5 shrink-0 rounded p-1 transition-colors hover:bg-red-500/10 hover:!text-red-500"
                          title={`Удалить "${item.title}"`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {canEdit && (
          <div className="border-border mt-2 border-t pt-2">
            <button
              onClick={onNewSectionClick}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[var(--text-sm)] transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Новая секция</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
