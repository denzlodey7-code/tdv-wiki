# STD-TEMPLATE-001: Standardized Wiki Template Principles

**Status:** Active
**Created:** 2026-06-22
**Applies to:** StsDev-Wiki-Template and all projects based on it

---

## 1. Universality (Universalnost)

The template must work with ANY content, not just the current wiki content.

- All components render purely from MDX input + frontmatter metadata
- No hardcoded page titles, section names, or content-specific logic in components
- Navigation is generated dynamically from file system (section + order fields)
- Theme/styling works in both light and dark mode regardless of content
- The template is content-agnostic: swap all MDX files and the template still functions

## 2. Predictability (Predskazuemost)

Same input always produces same output. No hidden state, no surprise behaviors.

- MDX rendering is deterministic: same MDX -> same HTML
- Navigation structure is computed from frontmatter, not from runtime state
- Component APIs are documented and stable (CodeBlock, Callout, Badge, MermaidDiagram)
- No random IDs in production (mermaid IDs use Math.random but only for rendering)
- CSS custom properties from globals.css are the single source of design tokens

## 3. Minimal Content Dependencies (Minimalnye Zavisimosti ot Kontenta)

Template components must NOT depend on specific content structure.

- Components accept props/data, never import or read content files directly
- MDX files are the only content source; no database content, no API content for display
- Adding a new MDX file with valid frontmatter is sufficient to add a new page
- No required fields beyond: title, section, sectionOrder, order, slug
- Optional frontmatter fields (description, icon) degrade gracefully when absent

## 4. Regression Control (Regressionnyj Kontrol)

Every change is verified. No silent breakage.

- ESLint enforces STD-DOC-003 (No-Unicode Policy) at [C] Critical level
- `showcase-real-content.mdx` serves as a visual regression test for all MDX components
- Three verification levels are mandatory for DONE status (file, build, logic)
- ADR records document all architectural decisions with rationale
- No rule changes without updating this file and the corresponding ADR

---

## Verification Checklist

| Check | How |
|-------|-----|
| New MDX file renders correctly | Add file, open in browser, verify |
| All components render | Check showcase-real-content.mdx page |
| ESLint passes | `npx eslint .` exits with 0 |
| Build passes | `npx next build` succeeds |
| Both themes work | Toggle light/dark, verify no flash or mismatch |
| Internal links work | Click every link on showcase page |