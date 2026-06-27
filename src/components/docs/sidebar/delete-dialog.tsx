"use client";

import React from "react";

interface DeleteDialogProps {
  target: { slug: string; title: string } | null;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({
  target,
  deleting,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background border-border mx-4 w-full max-w-[380px] rounded-xl border p-6 shadow-2xl">
        <h3 className="text-foreground mb-2 text-[15px] font-semibold">
          Удалить страницу?
        </h3>
        <p className="text-muted-foreground mb-5 text-[14px]">
          &laquo;{target.title}&raquo; будет удалена без возможности
          восстановления.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="border-border text-foreground hover:bg-muted/50 rounded-lg border px-4 py-2 text-[var(--text-sm)] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-[var(--text-sm)] text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}
