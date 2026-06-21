/**
 * StsDev-Wiki-Template — Cascade Tasks
 * Generated: 2026-06-22
 * Full audit of all application functions, typography, and UX issues.
 *
 * Format: { id, severity, title, description, file, fix }
 *   severity: P0 (crash/broken), P1 (wrong behavior), P2 (cosmetic/UX), P3 (cleanup/debt)
 */

const CASCADE_TASKS = [
  // =============================================
  //  P0 — CRASHES & BROKEN FUNCTIONALITY
  // =============================================

  {
    id: 'BUG-001',
    severity: 'P0',
    title: 'Copy button dead in ExpandableContent preview overlay',
    description:
      'ExpandableContent clones blocks via outerHTML into dangerouslySetInnerHTML. ' +
      'This strips all React event handlers — the Copy button becomes a dead <button> with no onClick. ' +
      'Fix: replace dangerouslySetInnerHTML with React portal or event delegation on the overlay ' +
      'that finds [aria-label="Copy code"] buttons and wires clipboard API via DOM addEventListener.',
    file: 'src/components/mdx/expandable-content.tsx',
    fix: 'Use event delegation: on overlay mount, query all [aria-label="Copy code"] buttons ' +
      'and attach click handlers that read the code text from the sibling/pre element. ' +
      'Alternatively, render via React.createElement instead of dangerouslySetInnerHTML.',
  },

  {
    id: 'BUG-002',
    severity: 'P0',
    title: 'Fallback slug "approaches-overview" does not exist — 404 loop on empty content dir',
    description:
      'page.tsx redirects to "approaches-overview" and docs/page.tsx to "paradigms-overview" as fallback. ' +
      'Neither slug exists in the 50 MDX files. If getAllPageIds() returns empty (e.g. content dir deleted), ' +
      'user gets an infinite redirect-to-404 loop. ' +
      'Also: the two fallback slugs are DIFFERENT between files — inconsistency.',
    file: 'src/app/page.tsx, src/app/docs/page.tsx',
    fix: 'Use getAllPageIds()[0] without fallback, or render a proper "No docs found" page. ' +
      'If a fallback is needed, use the same slug in both files (e.g. "o-sts-wiki-index").',
  },

  {
    id: 'BUG-003',
    severity: 'P0',
    title: 'Edit page delete redirects to non-existent "approaches-overview"',
    description:
      'edit/page.tsx line 88: router.push("/docs/approaches-overview/") after delete. ' +
      'This page does not exist, resulting in a 404 after deleting the current page.',
    file: 'src/app/docs/[slug]/edit/page.tsx',
    fix: 'After delete, navigate to the first available page from navigation, ' +
      'or to /docs/ which will redirect properly.',
  },

  // =============================================
  //  P1 — WRONG / UNEXPECTED BEHAVIOR
  // =============================================

  {
    id: 'BUG-004',
    severity: 'P1',
    title: 'GitHub link points to "#" — placeholder, not real repo',
    description:
      'header.tsx line 125: <a href="#">GitHub</a>. Clicking does nothing useful. ' +
      'The actual repo is https://github.com/stsgs1980/StsDev-Wiki-Template',
    file: 'src/components/docs/header.tsx',
    fix: 'Set href to the actual GitHub repository URL or make it configurable via env var.',
  },

  {
    id: 'BUG-005',
    severity: 'P1',
    title: 'Search only matches title/section/slug — no full-text search',
    description:
      'search-dialog.tsx filters by page.title, page.section, page.slug. ' +
      'Content body is not searched. For 50+ docs this makes search nearly useless ' +
      'if the user remembers a keyword from the body but not the title.',
    file: 'src/components/docs/search-dialog.tsx, src/lib/mdx-utils.ts',
    fix: 'Either: (a) pass content snippet into allPages on server, ' +
      'or (b) build a lightweight search index in mdx-utils.ts. ' +
      'For now, at minimum document this limitation.',
  },

  {
    id: 'BUG-006',
    severity: 'P1',
    title: 'ExpandableContent selector "div.my-4" is too broad',
    description:
      'EXPANDABLE_SELECTOR matches "div.my-4" which is the class on CodeBlock, PlainCodeBlock, ' +
      'Callout, etc. But it could also match any user-created div with my-4 class. ' +
      'Also: tables wrapped in div.overflow-x-auto get expanded, but the table wrapper ' +
      'might not have meaningful content if the table is small.',
    file: 'src/components/mdx/expandable-content.tsx',
    fix: 'Add data-expandable attribute to components that should be expandable, ' +
      'and use that as the selector instead of generic class names.',
  },

  {
    id: 'BUG-007',
    severity: 'P1',
    title: 'Sidebar slugify duplicated between sidebar.tsx and new/page.tsx',
    description:
      'The CYRILLIC_MAP transliteration map and slugify logic exist in both ' +
      'sidebar.tsx (slugifySectionName) and new/page.tsx (handleTitleChange). ' +
      'If the mapping is updated in one place, the other will diverge.',
    file: 'src/components/docs/sidebar.tsx, src/app/docs/new/page.tsx',
    fix: 'Extract to a shared utility in src/lib/slugify.ts.',
  },

  {
    id: 'BUG-008',
    severity: 'P1',
    title: 'TOC heading "On this page" is English while all UI is Russian',
    description:
      'toc.tsx renders "On this page" as the TOC heading. ' +
      'The rest of the sidebar uses Russian ("Новая секция", "Удалить страницу?"). ' +
      'Search dialog uses "No results found" (English) for empty state. ' +
      'Inconsistent bilingual UI.',
    file: 'src/components/docs/toc.tsx, src/components/docs/search-dialog.tsx',
    fix: 'Change TOC heading to Russian: "На этой странице". ' +
      'Change search empty state to "Ничего не найдено". ' +
      'Or create an i18n map for all UI strings.',
  },

  {
    id: 'BUG-009',
    severity: 'P1',
    title: 'Mobile sidebar drawer has no logo/branding — just "Navigation" text',
    description:
      'sidebar.tsx mobile drawer shows "Navigation" as a plain text header. ' +
      'No logo, no link to home, no visual identity. The desktop sidebar has no header at all. ' +
      'User cannot tap the logo to go back to the first page.',
    file: 'src/components/docs/sidebar.tsx',
    fix: 'Add logo + "StsDev Wiki" link in the mobile drawer header, matching the main header.',
  },

  // =============================================
  //  P2 — TYPOGRAPHY / DESIGN / UX
  // =============================================

  {
    id: 'DESIGN-001',
    severity: 'P2',
    title: 'Typography audit: font-size inconsistencies across components',
    description:
      'Font sizes are hardcoded as arbitrary values scattered across components: ' +
      '13px (sidebar items, search, header actions), 14px (new/edit labels, prev/next, search results), ' +
      '15px (expandable overlay, breadcrumb text), 16px (body text), 32px (h1), 30px (h2), 20px (h3), 16px (h4). ' +
      'No centralized type scale. The design tokens (--fib-*) exist in globals.css but are unused for typography. ' +
      'Per STD-DOC-003, all visual elements should use SVG/Lucide, not unicode (already compliant).',
    file: 'src/components/docs/header.tsx, sidebar.tsx, toc.tsx, search-dialog.tsx, docs-shell.tsx',
    fix: 'Create a type-scale in globals.css using CSS custom properties: ' +
      '--text-xs: 12px, --text-sm: 13px, --text-base: 14px, --text-md: 15px, --text-lg: 16px, ' +
      '--text-xl: 20px, --text-2xl: 30px, --text-3xl: 32px. ' +
      'Refactor all components to use these tokens.',
  },

  {
    id: 'DESIGN-002',
    severity: 'P2',
    title: '"О Sts Wiki" not in header — no way to switch knowledge bases',
    description:
      'User requests "О Sts Wiki" block placed before the "Docs" pill in the header nav. ' +
      'Currently the nav only has a static "Docs" span. ' +
      'The intent is to allow switching between multiple knowledge bases (wiki instances).',
    file: 'src/components/docs/header.tsx',
    fix: 'Add a dropdown/selector before the "Docs" pill that shows "О Sts Wiki" ' +
      'and allows switching knowledge bases. For now, implement as a clickable element ' +
      'with the current wiki name, expandable to a list in the future.',
  },

  {
    id: 'DESIGN-003',
    severity: 'P2',
    title: 'Prev/Next navigation uses English labels "Previous"/"Next"',
    description:
      'docs-shell.tsx renders "Previous" and "Next" as labels. ' +
      'All other UI text is in Russian. Inconsistent.',
    file: 'src/app/docs/[slug]/docs-shell.tsx',
    fix: 'Change to "Назад" / "Далее" or create a consistent i18n approach.',
  },

  {
    id: 'DESIGN-004',
    severity: 'P2',
    title: 'ExpandableContent overlay has hardcoded "15px" font size',
    description:
      'expandable-content.tsx line 134: style={{ fontSize: "15px" }}. ' +
      'This overrides the document base font size in the overlay. ' +
      'Should use the same body font size as the main content (16px per p component).',
    file: 'src/components/mdx/expandable-content.tsx',
    fix: 'Remove the hardcoded fontSize or set it to "16px" to match body text.',
  },

  {
    id: 'DESIGN-005',
    severity: 'P2',
    title: 'No scroll-to-top button on long pages',
    description:
      'Long documentation pages have no quick way to scroll back to top. ' +
      'The TOC and sidebar provide some navigation but no explicit "scroll to top" action.',
    file: 'src/app/docs/[slug]/docs-shell.tsx',
    fix: 'Add a floating scroll-to-top button that appears after scrolling down 400px.',
  },

  {
    id: 'DESIGN-006',
    severity: 'P2',
    title: 'Breadcrumb shows "Docs / Section" — "Docs" is not clickable',
    description:
      'docs-shell.tsx renders breadcrumb as plain <span>Docs / Section</span>. ' +
      'Neither "Docs" nor "Section" is a link. Standard UX expects breadcrumbs to be clickable.',
    file: 'src/app/docs/[slug]/docs-shell.tsx',
    fix: 'Make "Docs" link to /docs/ (index) and "Section" could scroll to or highlight ' +
      'the section in the sidebar.',
  },

  // =============================================
  //  P3 — CLEANUP / TECH DEBT
  // =============================================

  {
    id: 'CLEANUP-001',
    severity: 'P3',
    title: 'Dead code: Prisma setup (schema, db.ts, custom.db)',
    description:
      'prisma/schema.prisma, src/lib/db.ts, and db/custom.db exist but are completely unused. ' +
      'Content is file-based. db:push script is a no-op. "No database configured" in script.',
    file: 'prisma/schema.prisma, src/lib/db.ts, db/custom.db, package.json (db:push script)',
    fix: 'Delete prisma/, src/lib/db.ts, db/custom.db, and the db:push script from package.json.',
  },

  {
    id: 'CLEANUP-002',
    severity: 'P3',
    title: 'Dead code: api-handlers.ts duplicates route logic',
    description:
      'src/lib/api-handlers.ts (252 lines) contains CRUD handler functions ' +
      'that duplicate the inline logic in api/docs/route.ts, api/docs/[slug]/route.ts, etc. ' +
      'The route files do NOT import from api-handlers.ts — it is dead code.',
    file: 'src/lib/api-handlers.ts',
    fix: 'Delete src/lib/api-handlers.ts.',
  },

  {
    id: 'CLEANUP-003',
    severity: 'P3',
    title: 'Dead code: mdx-editor-wrapper.tsx is never imported',
    description:
      'src/components/mdx/mdx-editor-wrapper.tsx exists as a lazy-loading wrapper ' +
      'for MDXEditor but edit pages import MDXEditor directly.',
    file: 'src/components/mdx/mdx-editor-wrapper.tsx',
    fix: 'Either delete it or refactor edit pages to use it.',
  },

  {
    id: 'CLEANUP-004',
    severity: 'P3',
    title: 'console.error in production code (sidebar.tsx:272)',
    description:
      'sidebar.tsx has console.error("Delete failed:", err) in handleDeleteConfirm. ' +
      'User-facing alert follows, but the console.error should use a proper logging approach.',
    file: 'src/components/docs/sidebar.tsx',
    fix: 'Remove console.error or replace with a logging utility.',
  },

  {
    id: 'CLEANUP-005',
    severity: 'P3',
    title: '@zai/select-element duplicated: embedded copy + GitHub dependency',
    description:
      'package.json has "@zai/select-element": "github:stsgs1980/SelectElement" ' +
      'AND a full copy is embedded at src/lib/select-element/ (9 files). ' +
      'Dual inclusion is confusing and may cause version conflicts.',
    file: 'package.json, src/lib/select-element/',
    fix: 'Remove the embedded copy and use only the npm/GitHub dependency, ' +
      'or vice versa. Not both.',
  },

  {
    id: 'CLEANUP-006',
    severity: 'P3',
    title: 'next.config.ts has ignoreBuildErrors: true and reactStrictMode: false',
    description:
      'TypeScript errors are silently ignored during builds. React strict mode is off, ' +
      'suppressing double-render warnings that could catch bugs. allowedDevOrigins: ["*"] ' +
      'is overly permissive.',
    file: 'next.config.ts',
    fix: 'Enable ignoreBuildErrors: false and fix resulting TS errors. ' +
      'Enable reactStrictMode: true and fix any resulting issues. ' +
      'Restrict allowedDevOrigins to actual preview domains.',
  },

  {
    id: 'CLEANUP-007',
    severity: 'P3',
    title: 'No tests — zero test infrastructure',
    description:
      'No test files, no test runner, no test script in package.json. ' +
      'The project relies entirely on manual testing and ESLint.',
    file: 'package.json',
    fix: 'Add vitest + @testing-library/react. Start with unit tests for mdx-utils.ts ' +
      '(getAllSlugs, getDocBySlug, getNavigation, extractHeadings) and component render tests.',
  },

  {
    id: 'CLEANUP-008',
    severity: 'P3',
    title: 'No authentication on API routes',
    description:
      'All 5 API endpoints (list, get, create, update, delete, upload, reorder) are unprotected. ' +
      'execSync("git commit") can be triggered by any HTTP request.',
    file: 'src/app/api/docs/',
    fix: 'At minimum, add an API key check via env var or header. ' +
      'For production, add session-based auth.',
  },

  // =============================================
  //  FEATURE REQUESTS (from user)
  // =============================================

  {
    id: 'FEAT-001',
    severity: 'P1',
    title: 'Add "О Sts Wiki" wiki selector before "Docs" pill in header',
    description:
      'User wants a clickable element "О Sts Wiki" placed before the "Docs" nav pill. ' +
      'This will serve as a knowledge base switcher — allowing multiple wiki instances ' +
      'to be selected from the header.',
    file: 'src/components/docs/header.tsx',
    fix: 'Add a dropdown button/selector with the current wiki name. ' +
      'For v1, show the current wiki name as a clickable element. ' +
      'For v2, expand to a dropdown with multiple wiki options.',
  },
];

// Summary
const SUMMARY = {
  total: CASCADE_TASKS.length,
  bySeverity: {
    P0: CASCADE_TASKS.filter(t => t.severity === 'P0').length,
    P1: CASCADE_TASKS.filter(t => t.severity === 'P1').length,
    P2: CASCADE_TASKS.filter(t => t.severity === 'P2').length,
    P3: CASCADE_TASKS.filter(t => t.severity === 'P3').length,
  },
};

// Export for use as module or CLI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CASCADE_TASKS, SUMMARY };
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.CASCADE_TASKS = CASCADE_TASKS;
  // @ts-ignore
  window.CASCADE_SUMMARY = SUMMARY;
}