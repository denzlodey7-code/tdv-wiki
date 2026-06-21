#!/usr/bin/env python3
"""Convert StsDev-Wiki .md files to MDX with frontmatter for the template."""

import os
import re
import sys

WIKI_ROOT = "/tmp/StsDev-Wiki"
TARGET_DIR = "/home/z/my-project/src/content/docs"

# Section mapping from SUMMARY.md structure
SECTIONS = {
    "Ядро": {"order": 1, "files": [
        ("about.md", "Об авторе", 1),
        ("ecosystem-map.md", "Карта экосистемы", 2),
        ("vision.md", "Vision & Goals", 3),
        ("rules.md", "Правила", 4),
        ("standards.md", "Стандарты кода", 5),
        ("session-protocol.md", "Протокол сессии", 6),
        ("new-project-protocol.md", "Протокол нового проекта", 7),
    ]},
    "Принципы": {"order": 2, "files": [
        ("principles/anti-hallucination.md", "Анти-галлюцинация", 1),
        ("principles/construction-4d.md", "Строительство 4D", 2),
        ("principles/verification.md", "Верификация", 3),
    ]},
    "Решения": {"order": 3, "files": [
        ("decisions/language-strategy.md", "Языковая стратегия", 1),
    ]},
    "Пакеты": {"order": 4, "files": [
        ("packages/ui.md", "@stsgs/ui", 1),
        ("packages/prompting.md", "@stsgs/prompting", 2),
        ("packages/shared.md", "@stsgs/shared", 3),
    ]},
    "Проекты": {"order": 5, "files": [
        ("projects/index.md", "Все проекты", 1),
        ("projects/p-mas-architector/README.md", "P-MAS-architector", 2),
        ("projects/3a-studio/README.md", "3A Studio", 3),
        ("projects/3a-studio/master-plan.md", "3A Studio: Master Plan", 4),
        ("projects/3a-studio/requirements.md", "3A Studio: Требования", 5),
        ("projects/3a-studio/progress.md", "3A Studio: Прогресс", 6),
        ("projects/3a-studio/qa-test-results.md", "3A Studio: QA", 7),
        ("projects/3a-studio/screens.md", "3A Studio: Экраны", 8),
        ("projects/3a-studio/borrowing-map.md", "3A Studio: Заимствования", 9),
        ("projects/3a-studio/decisions/3a-studio-naming.md", "3A: Название", 10),
        ("projects/3a-studio/decisions/desktop-vs-web.md", "3A: Web vs Desktop", 11),
        ("projects/3a-studio/decisions/toolkit-placement.md", "3A: Toolkit отдельно", 12),
        ("projects/3a-studio/decisions/monorepo-vs-polyrepo.md", "3A: Monorepo", 13),
        ("projects/3a-studio/decisions/sqlite-vs-chromadb.md", "3A: SQLite vs ChromaDB", 14),
        ("projects/3a-studio/decisions/synthesis-strategy.md", "3A: Стратегия синтеза", 15),
        ("projects/ui-kit/README.md", "UI-Kit", 20),
        ("projects/component-browser/README.md", "Component-Browser", 21),
        ("projects/z-code-guide/README.md", "Z.Code.Guide", 22),
        ("projects/flow-studio-pro/README.md", "Flow-Studio-Pro", 23),
        ("projects/code-realm/README.md", "Code-Realm", 30),
        ("projects/hh-job-copilot/README.md", "HH-Job-Copilot", 31),
        ("projects/chromedna/README.md", "CHROMEDNA", 32),
        ("projects/wiki-codex-v2/README.md", "Wiki-Codex-v2", 33),
        ("projects/zai-agent-toolkit/README.md", "Zai-agent-toolkit", 40),
        ("projects/personal-site/README.md", "Stanislav-graur", 41),
    ]},
    "Агенты": {"order": 6, "files": [
        ("agents/index.md", "Все агенты", 1),
    ]},
    "Гайды": {"order": 7, "files": [
        ("guides/index.md", "Все гайды", 1),
        ("guides/sandbox-workflow.md", "Работа в песочнице", 2),
        ("guides/sandbox-preview-situational.md", "Preview & Dev Server", 3),
    ]},
    "Референсы": {"order": 8, "files": [
        ("references/index.md", "Все референсы", 1),
        ("references/llm-memory-techniques.md", "Техники памяти LLM", 2),
        ("references/rust-performance-optimization.md", "Rust Performance", 3),
    ]},
    "Инструменты": {"order": 9, "files": [
        ("tools/verify-docs/README.md", "verify-docs", 1),
    ]},
    "Обсуждения": {"order": 10, "files": [
        ("discussions/index.md", "Все обсуждения", 1),
        ("discussions/template.md", "Шаблон обсуждения", 2),
    ]},
}


def slugify(title: str) -> str:
    """Convert title to URL-safe slug."""
    slug = title.lower().strip()
    # Replace Cyrillic common chars
    cyrillic_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    result = []
    for ch in slug:
        if ch in cyrillic_map:
            result.append(cyrillic_map[ch])
        elif ch.isalnum() or ch in '-_':
            result.append(ch)
        elif ch.isspace():
            result.append('-')
    return re.sub(r'-+', '-', ''.join(result)).strip('-')


def convert_internal_links(content: str) -> str:
    """Convert GitBook-style relative links to wiki slug links."""
    # Pattern: [text](file.md) or [text](path/to/file.md)
    # Convert to: [text](/docs/slug/)
    def replacer(m):
        text = m.group(1)
        path = m.group(2)
        # Skip external links, images, anchors
        if path.startswith('http') or path.startswith('#') or path.startswith('!'):
            return m.group(0)
        # Get filename without extension
        basename = os.path.splitext(os.path.basename(path))[0]
        slug = slugify(basename)
        anchor = ''
        if '#' in path:
            # Keep anchor if present
            parts = path.split('#', 1)
            if len(parts) > 1:
                anchor = f'#{parts[1]}'
        return f'[{text}](/docs/{slug}/{anchor})'

    # Match markdown links but not images
    content = re.sub(r'(?<!!)\[([^\]]+)\]\(([^)]+)\)', replacer, content)
    return content


def convert_file(source_path: str, section: str, title: str, order: int, section_order: int, slug: str):
    """Read a .md file, add frontmatter, write as .mdx."""
    if not os.path.exists(source_path):
        print(f"  SKIP (not found): {source_path}")
        return False

    with open(source_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Convert internal links
    content = convert_internal_links(content)

    # Build frontmatter
    frontmatter = f"""---
title: "{title}"
section: "{section}"
sectionOrder: {section_order}
order: {order}
slug: "{slug}"
---

"""

    target_path = os.path.join(TARGET_DIR, f"{slug}.mdx")
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter + content)

    print(f"  OK: {slug}.mdx ({len(content)} chars)")
    return True


def main():
    # Backup existing content docs (keep the template index)
    print("=== Converting StsDev-Wiki to MDX ===\n")

    total = 0
    ok = 0

    for section_name, section_data in SECTIONS.items():
        print(f"[{section_name}] (sectionOrder: {section_data['order']})")
        for rel_path, title, order in section_data["files"]:
            total += 1
            source = os.path.join(WIKI_ROOT, rel_path)
            slug = slugify(title)
            if convert_file(source, section_name, title, order, section_data["order"], slug):
                ok += 1

    print(f"\n=== Result: {ok}/{total} files converted ===")


if __name__ == "__main__":
    main()