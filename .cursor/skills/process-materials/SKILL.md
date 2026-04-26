---
name: process-materials
description: >-
  Extract and systematize existing reference materials (e.g. from `学习、参考资料/`) into the knowledge base or interview questions directories.
---

# Process Existing Materials

**When to use:**
Use this skill when the user asks you to read, organize, or incorporate existing documents, PDFs, or Markdown files from the `学习、参考资料/` (or similar) folder into the main VitePress site.

## Workflow

1. **Read the Source Material:**
   - Use the `Read` tool to scan the requested file(s) in the reference folder.
   - If the file is large, process it in chunks or outline its main topics first.

2. **Categorize the Content:**
   - Determine if the content is **Knowledge** (concepts, tutorials, architectures) or **Interviews** (Q&A, specific real-world interview transcripts).
   - Determine the correct sub-directory in `docs/knowledge/` or `docs/interviews/` (e.g., `data-sql`, `ai-agent`, `quant-research`).

3. **Draft the Markdown Pages:**
   - Write the content directly into `docs/` using the rules defined in `.cursor/rules/content-standards.mdc`.
   - Ensure the YAML Frontmatter is included (`title`, `outline: deep`).
   - If the content is an addition to an existing topic, append/merge it logically into the existing file instead of creating a new one.

4. **Update the VitePress Sidebar:**
   - If you created *new* files, you MUST update `docs/.vitepress/config.ts` according to `.cursor/rules/vitepress-sidebar.mdc`.

5. **Review and Commit:**
   - Review your changes for high cohesion (related topics stay together).
   - Use the `Shell` tool to commit the newly organized pages to the git repository.
