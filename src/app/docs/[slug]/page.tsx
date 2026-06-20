import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import React from 'react';
import {
  getAllSlugs,
  getDocBySlug,
  getNavigation,
  getAdjacentPages,
  extractHeadings,
} from '@/lib/mdx-utils';
import MDXContent from '@/components/mdx/mdx-content';
import DocsShell from './docs-shell';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// dynamicParams: true allows newly created pages to render on-demand
// without a full rebuild. For static export (GitHub Pages) this is ignored
// because output: "export" generates all pages at build time anyway.
export const dynamicParams = true;

// Revalidate every 10s so new/updated pages appear without full rebuild
export const revalidate = 10;

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = getDocBySlug(slug);
    return {
      title: `${doc.meta.title} — StsDev Wiki`,
      description: `Documentation: ${doc.meta.title} (${doc.meta.section})`,
    };
  } catch {
    return { title: 'StsDev Wiki' };
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
  const adjacent = getAdjacentPages(slug);
  const headings = extractHeadings(doc.content);
  const section = doc.meta.section;
  const canEdit = process.env.GITHUB_PAGES !== 'true';

  // Pre-render MDX on the server — MDXRemote is an async Server Component
  // and cannot be used inside a Client Component ('use client').
  const renderedContent = <MDXContent source={doc.content} />;

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
    />
  );
}
