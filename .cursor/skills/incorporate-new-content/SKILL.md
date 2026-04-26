---
name: incorporate-new-content
description: >-
  Incorporate newly provided user inputs (text, images, scattered snippets) into the structured knowledge base.
---

# Incorporate New Content

**When to use:**
Use this skill when the user sends you new information, images, screenshots, or chat messages and asks you to "organize this," "put this in the knowledge base," or "save this interview question."

## Workflow

1. **Analyze the User's Input:**
   - Read the provided text or image.
   - Identify whether it's a concept (Knowledge) or a question/transcript (Interview).
   - Identify the technical domain (SQL, Python, Product, AI Agent, Quant).

2. **Handle Images:**
   - If the user provides an image, and you need to save or reference it, the image MUST go into `docs/public/images/`.
   - In the Markdown file, reference it strictly as `![alt text](/images/filename.png)`.

3. **Integrate the Content:**
   - Search the codebase using the `Glob` or `Grep` tools to see if a relevant file already exists (e.g., `docs/interviews/data-analytics/sql-exercises.md`).
   - If a matching file exists, append or merge the new content into the relevant section. Ensure consistent heading levels.
   - If it's a completely new topic, create a new Markdown file adhering to `.cursor/rules/content-standards.mdc` (including YAML Frontmatter).

4. **Update the Sidebar (If Applicable):**
   - If a *new* file was created, update `docs/.vitepress/config.ts` so the user can navigate to it.

5. **Commit the Changes:**
   - Use the `Shell` tool to commit the newly integrated content to the git repository. Keep the commit message descriptive about what new knowledge was added.
