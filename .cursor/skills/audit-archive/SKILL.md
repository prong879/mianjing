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

3. **Copying and Merging (DO NOT MOVE OR MODIFY ARCHIVE):**
   - **COPY** (do not move/cut) any missing content into the appropriate specific file in `docs/knowledge/` (for theoretical knowledge) or `docs/interviews/` (for interview questions).
   - If you find duplicated content across multiple files, merge them into a single, cohesive section in the new `docs/` directory.
   - Improve the formatting of the **newly copied content** in `docs/` to strictly follow `.cursor/rules/content-standards.mdc` (e.g., adding language tags to code blocks, fixing header hierarchies, ensuring proper spacing between Chinese and English). **DO NOT modify the legacy content in `归档/`.**

4. **Directory & Link Cleanup (In `docs/` ONLY):**
   - If legacy images were referenced via external links or broken relative paths, download/copy them to `docs/public/images/` and update the markdown references to `/images/...` in the **new `docs/` files**.
   - Ensure all internal cross-links between documents work correctly in the new structure.

5. **Commit and Report:**
   - **CRITICAL:** Before committing, you MUST present the proposed commit message to the user and ask for their confirmation.
   - Once the user confirms, use the `Shell` tool to commit the refactored changes.
   - **MUST follow the Git standards defined in `.cursor/rules/git-standards.mdc`** (e.g., `refactor(archive): 整理并补充遗留数据`).
   - Summarize to the user what specific missing contents were found and where they were copied.

6. **Preserve Original Source Files (🔴 RED LINE):**
   - **Archived files (`归档/`) are STRICTLY READ-ONLY**. "Once archived, it is never modified" (归档了就是不改了).
   - NEVER delete, move, or modify any files in `归档/`. Always leave the original files exactly as they are to prevent data loss.
