'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { NavSection } from '@/lib/mdx-utils';

interface SidebarProps {
  currentSlug: string;
  navigation: NavSection[];
  onNavigate: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
}

export default function Sidebar({
  currentSlug,
  navigation,
  onNavigate,
  isOpen,
  onClose,
  canEdit = true,
}: SidebarProps) {
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const handleNavigate = (slug: string) => {
    onNavigate(slug);
    onClose();
  };

  const handleCreateInSection = useCallback((sectionTitle: string) => {
    const params = new URLSearchParams({ section: sectionTitle });
    window.location.href = `/docs/new/?${params.toString()}`;
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/docs/${deleteTarget.slug}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      // If we deleted the current page, navigate away
      if (deleteTarget.slug === currentSlug) {
        const firstSlug = navigation[0]?.items[0]?.slug;
        if (firstSlug) {
          onNavigate(firstSlug);
        } else {
          window.location.href = '/docs/';
        }
      }
      // Full refresh to update navigation
      window.location.reload();
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, currentSlug, navigation, onNavigate]);

  const sidebarContent = (
    <nav className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        {navigation.map((section) => {
          const isSectionOpen = openSections.has(section.title);
          const isActive = section.items.some((i) => i.slug === currentSlug);

          return (
            <div key={section.title} className="mb-1">
              <div className="flex items-center">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center flex-1 min-w-0 px-2 py-1.5 text-[13px] font-medium rounded-md transition-colors text-left ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  } hover:text-foreground`}
                >
                  {isSectionOpen ? (
                    <ChevronDown className="h-3 w-3 mr-1.5 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1.5 shrink-0" />
                  )}
                  <span className="break-words truncate">{section.title}</span>
                </button>
                {canEdit && (
                  <button
                    onClick={() => handleCreateInSection(section.title)}
                    className="p-1 mr-1 rounded text-muted-foreground/0 hover:text-muted-foreground hover:bg-muted/50 transition-colors group/section"
                    title={`Добавить в "${section.title}"`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              {isSectionOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  {section.items.map((item) => (
                    <div
                      key={item.slug}
                      className="group/item flex items-center"
                    >
                      <button
                        onClick={() => handleNavigate(item.slug)}
                        className={`flex-1 min-w-0 text-left px-2.5 py-1.5 text-[13px] rounded-md transition-all break-words ${
                          currentSlug === item.slug
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                      </button>
                      {canEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget({ slug: item.slug, title: item.title });
                          }}
                          className="p-1 mr-0.5 rounded text-muted-foreground/0 group-hover/item:text-muted-foreground/60 hover:!text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
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
      </div>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background border border-border rounded-xl p-6 max-w-[380px] w-full mx-4 shadow-2xl">
            <h3 className="text-[15px] font-semibold text-foreground mb-2">
              Удалить страницу?
            </h3>
            <p className="text-[14px] text-muted-foreground mb-5">
              &laquo;{deleteTarget.title}&raquo; будет удалена без возможности восстановления.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-[13px] rounded-lg border border-border text-foreground hover:bg-muted/50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-[13px] font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — width controlled by docs-golden-grid (280px on xl+) */}
      <aside className="hidden xl:block shrink-0 border-r border-border bg-sidebar h-[calc(100vh-49px)] sticky top-[49px]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 xl:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 z-50 w-[280px] h-full bg-sidebar xl:hidden shadow-2xl">
            <div className="flex items-center h-[49px] px-4 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                Navigation
              </span>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
