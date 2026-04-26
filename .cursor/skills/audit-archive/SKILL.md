---
name: audit-archive
description: >-
  Audit, cross-check, and refactor the legacy content from `归档/` to ensure all previous knowledge and interview questions were correctly split, reorganized, and merged into the new `docs/` structure without data loss.
---

# Audit and Refactor Archive

**When to use:**
Use this skill when the user asks to "check the archive", "audit the split", or "ensure no content was lost from the original 归档 directory". It serves as a quality assurance and refactoring workflow for legacy content.

## Workflow

1. **Information Gathering & Mapping:**
   - Use the `Glob` and `Read` tools to scan the legacy files in the `归档/` directory.
   - Identify the mapping between the legacy sections and the current files in `docs/knowledge/` and `docs/interviews/`.

2. **Cross-Checking for Completeness:**
   - Compare the content of the legacy files against the newly structured `.md` files in `docs/`.
   - Identify any paragraphs, Q&A pairs, or images that were **missed, truncated, or incorrectly categorized** during the previous automated script splitting.

3. **Refactoring and Merging:**
   - Move any missing content into the appropriate specific file in `docs/knowledge/` (for theoretical knowledge) or `docs/interviews/` (for interview questions).
   - If you find duplicated content across multiple files, merge them into a single, cohesive section.
   - Improve the formatting of the legacy content to strictly follow `.cursor/rules/content-standards.mdc` (e.g., adding language tags to code blocks, fixing header hierarchies, ensuring proper spacing between Chinese and English).

4. **Directory & Link Cleanup:**
   - If legacy images were referenced via external links or broken relative paths, download/move them to `docs/public/images/` and update the markdown references to `/images/...`.
   - Ensure all internal cross-links between documents work correctly.

5. **Commit and Report:**
   - Use the `Shell` tool to commit the refactored changes with a clear message detailing what content was salvaged or reorganized.
   - Summarize to the user what specific missing contents were found and where they were placed.
