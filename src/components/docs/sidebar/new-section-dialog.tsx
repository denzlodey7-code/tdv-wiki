"use client";

import React from "react";
import type { NavSection } from "@/lib/mdx-utils";

interface NewSectionDialogProps {
  show: boolean;
  name: string;
  position: "end" | "before" | "after";
  ref_: string;
  creating: boolean;
  navigation: NavSection[];
  onNameChange: (value: string) => void;
  onPositionChange: (value: "end" | "before" | "after") => void;
  onRefChange: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export default function NewSectionDialog({
  show,
  name,
  position,
  ref_,
  creating,
  navigation,
  onNameChange,
  onPositionChange,
  onRefChange,
  onCreate,
  onCancel,
}: NewSectionDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background border-border mx-4 w-full max-w-[420px] rounded-xl border p-6 shadow-2xl">
        <h3 className="text-foreground mb-4 text-[15px] font-semibold">
          Новая секция
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-[var(--text-xs)]">
              Название секции
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Например: API Reference"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onCreate();
              }}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-[14px] focus:ring-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted-foreground mb-1.5 block text-[var(--text-xs)]">
              Позиция
            </label>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sectionPos"
                  value="end"
                  checked={position === "end"}
                  onChange={() => onPositionChange("end")}
                  className="accent-foreground"
                />
                <span className="text-foreground text-[14px]">В конец</span>
              </label>
              {navigation.length > 0 && (
                <>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="sectionPos"
                      value="before"
                      checked={position === "before"}
                      onChange={() => {
                        onPositionChange("before");
                        if (!ref_) onRefChange(navigation[0].title);
                      }}
                      className="accent-foreground"
                    />
                    <span className="text-foreground text-[14px]">
                      Перед секцией
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="sectionPos"
                      value="after"
                      checked={position === "after"}
                      onChange={() => {
                        onPositionChange("after");
                        if (!ref_) onRefChange(navigation[0].title);
                      }}
                      className="accent-foreground"
                    />
                    <span className="text-foreground text-[14px]">
                      После секции
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          {(position === "before" || position === "after") &&
            navigation.length > 0 && (
              <div>
                <label className="text-muted-foreground mb-1.5 block text-[var(--text-xs)]">
                  {position === "before"
                    ? "Перед какой секцией"
                    : "После какой секции"}
                </label>
                <select
                  value={ref_}
                  onChange={(e) => onRefChange(e.target.value)}
                  className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-[14px] focus:ring-1 focus:outline-none"
                >
                  {navigation.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={creating}
            className="border-border text-foreground hover:bg-muted/50 rounded-lg border px-4 py-2 text-[var(--text-sm)] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onCreate}
            disabled={creating || !name.trim()}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4 py-2 font-medium text-[var(--text-sm)] transition-colors disabled:opacity-50"
          >
            {creating ? "Создание..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
