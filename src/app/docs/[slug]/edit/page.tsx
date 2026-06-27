"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { getEditorPlugins } from "@/components/editor/mdx-editor-config";
import { useEditDoc } from "./use-edit-doc";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { FrontmatterEditor } from "./frontmatter-editor";

export default function EditDocPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    doc,
    setDoc,
    loading,
    saving,
    error,
    success,
    commitMessage,
    setCommitMessage,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
    handleSave,
  } = useEditDoc({ slug, router });

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-muted-foreground/20 border-t-muted-foreground/60 h-8 w-8 animate-spin rounded-full border-2" />
      </div>
    );
  }

  if (error && !doc) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push(`/docs/${slug}`)}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4 py-2"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <div className="border-border bg-background sticky top-0 z-30 border-b">
        <div className="flex h-[49px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/docs/${slug}`)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[14px] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к странице
            </button>
            <span className="text-muted-foreground text-[14px]">|</span>
            <span className="text-foreground text-[14px] font-medium">
              Редактирование: {doc.meta.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Сообщение коммита..."
              className="border-border text-foreground placeholder:text-muted-foreground focus:ring-ring hidden w-[240px] rounded-md border bg-transparent px-3 py-1.5 text-[13px] focus:ring-1 focus:outline-none sm:block"
            />
            <button
              onClick={() => router.push(`/docs/${slug}`)}
              className="border-border text-foreground hover:bg-muted/50 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg border border-red-500/40 px-3 py-1.5 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
            >
              Удалить
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-500/10 px-4 py-2 text-[13px] text-red-500">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 px-4 py-2 text-[13px] text-green-500">
            {success}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmDialog
        show={showDeleteConfirm}
        title={doc.meta.title}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Frontmatter edit */}
      <FrontmatterEditor doc={doc} onChange={setDoc} />

      {/* MDX Editor */}
      <div className="mx-auto max-w-[960px] px-4 py-6">
        <div className="border-border [&_.mdxeditor-toolbar]:border-border [&_.mdxeditor-toolbar]:bg-muted/30 overflow-hidden rounded-lg border [&_.mdxeditor]:min-h-[60vh] [&_.mdxeditor-toolbar]:border-b">
          <MDXEditor
            markdown={doc.content}
            onChange={(md) => setDoc({ ...doc, content: md })}
            plugins={getEditorPlugins({
              markdown: doc.content,
              withFrontmatter: true,
            })}
          />
        </div>
      </div>
    </div>
  );
}
