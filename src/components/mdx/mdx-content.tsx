import React from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  CodeBlock,
  InlineCode,
  PlainCodeBlock,
  MermaidDiagram,
  Callout,
  Badge,
} from "@/components/mdx/mdx-components";
import ExpandableContent from "@/components/mdx/expandable-content";
import { getAllSlugs } from "@/lib/mdx-utils";
import {
  rehypeStatusBadges,
  remarkFencedCodeDefaultLang,
} from "@/lib/mdx-plugins";

interface MDXContentProps {
  source: string;
}

/**
 * Server component that renders MDX content with all wiki components.
 * Uses next-mdx-remote/rsc for server-side rendering.
 * Validates internal links against known slugs at render time.
 */
export default function MDXContent({ source }: MDXContentProps) {
  const validSlugs = getAllSlugs();
  const components = buildMdxComponents(validSlugs);

  return (
    <ExpandableContent>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkFencedCodeDefaultLang],
            rehypePlugins: [rehypeSlug, rehypeStatusBadges],
          },
        }}
      />
    </ExpandableContent>
  );
}

function typographyOverrides() {
  return {
    h1: () => null,
    h2: ({
      children,
      id,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        id={id}
        className="text-foreground mt-10 mb-4 scroll-mt-20 text-[var(--text-2xl)] leading-[var(--leading-heading)] font-medium"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({
      children,
      id,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        id={id}
        className="text-foreground mt-8 mb-3 scroll-mt-20 text-[var(--text-xl)] leading-[var(--leading-heading)] font-semibold"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({
      children,
      id,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        id={id}
        className="text-foreground mt-6 mb-2 scroll-mt-20 text-[var(--text-lg)] leading-[var(--leading-heading)] font-semibold"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-muted-foreground mb-4 text-[var(--text-lg)] leading-[var(--leading-body)]">
        {children}
      </p>
    ),
    strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
      <strong className="text-foreground font-medium">{children}</strong>
    ),
    em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
      <em className="text-foreground/80 italic">{children}</em>
    ),
    ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
    li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="text-muted-foreground text-[var(--text-lg)] leading-[var(--leading-body)]">
        {children}
      </li>
    ),
    del: ({ children }: React.HTMLAttributes<HTMLElement>) => (
      <del className="text-muted-foreground line-through">{children}</del>
    ),
  };
}

function tableOverrides() {
  return {
    table: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="border-border my-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-[var(--text-base)]">{children}</table>
      </div>
    ),
    thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted">{children}</thead>
    ),
    th: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th className="text-foreground border-border border-b px-4 py-3 text-left font-medium whitespace-nowrap">
        {children}
      </th>
    ),
    td: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="text-muted-foreground border-border/50 border-b px-4 py-3">
        {children}
      </td>
    ),
  };
}

function codeOverrides() {
  return {
    code: ({
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      const match = /language-([\w+.-]+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (!match) return <InlineCode>{children}</InlineCode>;
      if (match[1] === "plain")
        return <PlainCodeBlock>{codeString}</PlainCodeBlock>;
      if (match[1] === "mermaid") return <MermaidDiagram code={codeString} />;

      return <CodeBlock language={match[1]}>{codeString}</CodeBlock>;
    },
    pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
      if (React.isValidElement(children)) {
        if (children.type === InlineCode) {
          const text = String(
            (children.props as { children: React.ReactNode }).children,
          ).replace(/\n$/, "");
          return <PlainCodeBlock>{text}</PlainCodeBlock>;
        }
        return <>{children}</>;
      }
      const text = String(children).replace(/\n$/, "");
      return <PlainCodeBlock>{text}</PlainCodeBlock>;
    },
  };
}

function linkOverrides(validSlugs: string[]) {
  const linkClass =
    "text-[oklch(0.45_0.15_250)] hover:underline dark:text-[oklch(0.685_0.169_237.323)]";
  const brokenLinkClass =
    "text-red-500/70 hover:underline dark:text-red-400/70 line-through decoration-red-400/50";

  return {
    a: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = href?.startsWith("http") || href?.startsWith("//");

      if (isExternal) {
        return (
          <a
            href={href}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }

      const rawSlug = (href || "/").replace(/^\/docs\//, "").replace(/\/$/, "");
      const isValid = rawSlug === "" || validSlugs.includes(rawSlug);

      if (!isValid) {
        return (
          <span
            className={brokenLinkClass}
            title={`Broken link: /docs/${rawSlug}/ does not exist`}
          >
            {children}
          </span>
        );
      }

      return (
        <Link href={href || "/"} className={linkClass}>
          {children}
        </Link>
      );
    },
  };
}

function buildMdxComponents(validSlugs: string[]) {
  return {
    CodeBlock,
    Callout,
    Badge,
    MermaidDiagram,
    ...typographyOverrides(),
    ...tableOverrides(),
    ...codeOverrides(),
    ...linkOverrides(validSlugs),
    blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-border text-muted-foreground [&_strong]:text-foreground [&_em]:text-foreground/80 [&_code]:bg-muted my-4 border-l-2 pl-4 not-italic [&_a]:text-[oklch(0.45_0.15_250)] dark:[&_a]:text-[oklch(0.685_0.169_237.323)] [&_a:hover]:underline [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[var(--text-sm)] [&_em]:italic [&_p]:mb-1 [&_p]:text-[var(--text-base)] [&_p]:leading-[var(--leading-body)] [&_p:last-child]:mb-0 [&_strong]:font-medium">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-8" />,
    img: ({
      src,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        src={src}
        alt={alt || ""}
        className="my-4 h-auto max-w-full rounded-lg"
        loading="lazy"
        {...props}
      />
    ),
  };
}
