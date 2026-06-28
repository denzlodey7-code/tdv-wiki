import { notFound } from "next/navigation";
import type { Metadata } from "next";
import React from "react";
import { getDocBySlug, getNavigation, extractHeadings } from "@/lib/mdx-utils";
import MDXContent from "@/components/mdx/mdx-content";
import DocsShell from "./docs-shell";
import { getVersion } from "@/lib/version";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fully dynamic — no ISR cache, always reads fresh files from disk.
// This ensures newly created pages are immediately accessible.
// For static export (GitHub Pages), we use generateStaticParams.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const { getAllPageIds } = await import("@/lib/mdx-utils");
  return getAllPageIds().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = getDocBySlug(slug);
    return {
      title: `${doc.meta.title} — TDV`,
      description: `Documentation: ${doc.meta.title} (${doc.meta.section})`,
    };
  } catch {
    return { title: "TDV" };
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  let doc;
  try {
    doc = getDocBySlug(slug);
  } catch {
    notFound();
  }

  const navigation = getNavigation();
  const headings = extractHeadings(doc.content);
  const section = doc.meta.section;
  const canEdit = process.env.CAN_EDIT !== "false";

  // Adjacent pages: navigate between sections (1 file = 1 tab)
  const sectionIdx = navigation.findIndex((s) => s.title === section);
  const adjacent = {
    prev:
      sectionIdx > 0
        ? {
            slug: navigation[sectionIdx - 1].items[0].slug,
            title: navigation[sectionIdx - 1].title,
          }
        : undefined,
    next:
      sectionIdx < navigation.length - 1 && navigation[sectionIdx + 1].items.length > 0
        ? {
            slug: navigation[sectionIdx + 1].items[0].slug,
            title: navigation[sectionIdx + 1].title,
          }
        : undefined,
  };

  // Pre-render MDX on the server — MDXRemote is an async Server Component
  // and cannot be used inside a Client Component ('use client').
  const renderedContent = <MDXContent source={doc.content} />;

  const version = getVersion();

  return (
    <DocsShell
      slug={slug}
      title={doc.meta.title}
      section={section}
      renderedContent={renderedContent}
      navigation={navigation}
      headings={headings}
      adjacent={adjacent}
      canEdit={canEdit}
      version={version.version}
    />
  );
}
