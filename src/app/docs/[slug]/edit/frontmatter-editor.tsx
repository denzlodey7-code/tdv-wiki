"use client";

import React from "react";
import type { DocData } from "./use-edit-doc";

interface FrontmatterEditorProps {
  doc: DocData;
  onChange: (updated: DocData) => void;
}

export function FrontmatterEditor({ doc, onChange }: FrontmatterEditorProps) {
  return (
    <div className="border-border bg-muted/30 border-b">
      <details className="mx-auto max-w-[960px] px-4 py-3">
        <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-[14px] font-medium">
          Метаданные (frontmatter)
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-muted-foreground mb-1 block text-[12px]">
              Заголовок
            </label>
            <input
              type="text"
              value={doc.meta.title}
              onChange={(e) =>
                onChange({
                  ...doc,
                  meta: { ...doc.meta, title: e.target.value },
                })
              }
              className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-1.5 text-[14px] focus:ring-1 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[12px]">
              Секция
            </label>
            <input
              type="text"
              value={doc.meta.section}
              onChange={(e) =>
                onChange({
                  ...doc,
                  meta: { ...doc.meta, section: e.target.value },
                })
              }
              className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-1.5 text-[14px] focus:ring-1 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[12px]">
              Порядок секции
            </label>
            <input
              type="number"
              value={doc.meta.sectionOrder ?? 0}
              onChange={(e) =>
                onChange({
                  ...doc,
                  meta: {
                    ...doc.meta,
                    sectionOrder: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-1.5 text-[14px] focus:ring-1 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[12px]">
              Порядок страницы
            </label>
            <input
              type="number"
              value={doc.meta.order}
              onChange={(e) =>
                onChange({
                  ...doc,
                  meta: { ...doc.meta, order: parseInt(e.target.value) || 0 },
                })
              }
              className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-1.5 text-[14px] focus:ring-1 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[12px]">
              Slug
            </label>
            <input
              type="text"
              value={doc.meta.slug}
              disabled
              className="border-border bg-muted text-muted-foreground w-full cursor-not-allowed rounded-md border px-3 py-1.5 text-[14px]"
            />
          </div>
        </div>
      </details>
    </div>
  );
}
