---
name: incorporate-new-content
description: >-
  Incorporate newly provided user inputs (text, images, scattered snippets) into the structured knowledge base.
---

# Incorporate New Content

**When to use:**
Use this skill when the user sends you new information, images, screenshots, or chat messages and asks you to "organize this," "put this in the knowledge base," or "save this interview question."

## Workflow

1. **Analyze and Enhance the User's Input:**
   - Read the provided text or image.
   - **Infer and Complete Questions**: If the provided image or text contains incomplete questions, truncated sentences, or lacks context, use your analytical skills to infer and reconstruct the complete question.
   - **Provide Detailed Answers**: If the provided materials lack answers or the answers are incomplete, you MUST act as an expert and provide a comprehensive, accurate answer. Use the `WebSearch` tool if you need to verify facts or find the most up-to-date industry standard answers.
   - Identify whether it's a concept (Knowledge) or a question/transcript (Interview).
   - Identify the technical domain (SQL, Python, Product, AI Agent, Quant).
   - **CRITICAL**: The knowledge base uses a strict 6-pillar ability structure (`01-data-infrastructure`, `02-python-data`, `03-statistics-experiment`, `04-business-product`, `05-ai-ml`, `06-quant-finance`). Before deciding on a folder, you MUST use the `Read` tool to inspect `docs/.vitepress/config.ts` to see the exact allowed directory paths. NEVER invent new top-level directories.
   - **Extract Metadata**: Identify any company names (e.g., ByteDance, Tencent), interview stages (e.g., 1st round, HR), or years from the prompt. Pay special attention to whether it is a **written test (笔试)** or **coding task (机试/手撕代码)**.

2. **Handle Images:**
   - If the user provides an image, and you need to save or reference it, the image MUST go into `docs/public/images/`.
   - In the Markdown file, reference it strictly as `![alt text](/images/filename.png)`.

3. **Integrate the Content:**
   - Search the codebase using the `Glob` or `Grep` tools to see if a relevant file already exists (e.g., `docs/interviews/01-data-analytics/sql/sql-exercises.md`).
   - If a matching file exists, append or merge the new content into the relevant section. Ensure consistent heading levels. **Also append tags/metadata (like `> 🏷️ 标签：字节跳动，一面，笔试，手撕代码`) under the specific question.**
   - **Code Blocks**: When the question or answer involves code, strictly use Markdown code blocks with the correct language identifier (e.g., ` ```python `) and ensure proper formatting and indentation.
   - If it's a completely new topic, create a new Markdown file adhering to `.cursor/rules/content-standards.mdc` (including YAML Frontmatter **with `tags`**). Ensure it is placed in the correct numbered ability-pillar directory (e.g. `docs/knowledge/05-ai-ml/`).

4. **Update the Sidebar (If Applicable):**
   - If a *new* file was created, update `docs/.vitepress/config.ts` so the user can navigate to it.

5. **Commit the Changes:**
   - **CRITICAL:** Before committing, you MUST present the proposed commit message to the user and ask for their confirmation.
   - Once the user confirms, use the `Shell` tool to commit the newly integrated content to the git repository.
   - **MUST follow the Git standards defined in `.cursor/rules/git-standards.mdc`** (e.g., `feat(interviews): 新增...`).
