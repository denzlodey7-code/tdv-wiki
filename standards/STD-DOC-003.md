# STD-DOC-003: No-Unicode Policy v2.3

**Status:** Active
**Enforcement:** Automated via ESLint plugin
**Created:** 2026-06-22
**Applies to:** All StsDev projects

---

## Principle

Production code must not contain emoji or unicode graphics characters. These create:
- Rendering inconsistencies across platforms
- Lint noise and diff pollution
- Accessibility issues (screen readers cannot pronounce emoji)
- Encoding bugs in CI/CD pipelines

## What is Banned

### [C] Critical (Error) - Production Code (.ts, .tsx, .js, .jsx)

| Category | Unicode Ranges | Examples |
|----------|---------------|----------|
| Emoji | U+1F600-1F64F, U+1F300-1F5FF, U+2600-27BF, U+1F900-1FAFF, U+2702-27B0 | `[OK]`, `[FAIL]`, checkmarks, crosses |
| Unicode graphics | U+2500-257F (box drawing), U+2580-259F (blocks), U+25A0-25FF (geometric), U+2190-21FF (arrows), U+2200-22FF (math), U+2300-23FF (technical), U+2400-244A (control pictures), U+2800-28FF (braille) | Box-drawing, arrows as text |

### [W] Warning - Markdown Files (.md, .mdx)

Same rules, but at warning level to allow documentation flexibility.

## What is Allowed

- Unicode in string literals inside triple-backtick code blocks (markdown only)
- CJK characters (Chinese, Japanese, Korean) in content files
- Standard Latin, Cyrillic, and common punctuation
- SVG icons and components for visual indicators

## Replacements

| Instead of | Use |
|-----------|-----|
| Checkmark emoji | Text tag `[OK]` or SVG icon component |
| Cross emoji | Text tag `[FAIL]` or SVG icon component |
| Box-drawing tables | Markdown tables or HTML tables |
| Arrow characters in UI | SVG icons from lucide-react |

## ESLint Implementation

- Plugin: `eslint-rules/no-unicode-policy.js`
- Rules: `no-emoji`, `no-unicode-graphics`, `no-emoji-in-md`, `no-unicode-graphics-in-md`
- Config: `eslint.config.mjs` references plugin and sets severity per file type
- Markdown rules skip content inside triple-backtick code blocks

## See Also

- `eslint-rules/no-unicode-policy.js` - Plugin source code
- `eslint.config.mjs` - Rule configuration
- `standarty-koda` MDX page - Code standards documentation