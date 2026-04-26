import os
import glob

replacements = {
    '/interviews/02-ai-agent/questions': '/interviews/02-ai-agent/prompt-engineering',
    '/interviews/03-quant-finance/knowledge-questions': '/interviews/03-quant-finance/math-stats',
    '/interviews/04-product-manager/jd-and-qa': '/interviews/04-product-manager/product-sense',
    '/interviews/04-product-manager/glossary': '/interviews/04-product-manager/strategy-design',
    '/interviews/03-quant-finance/resume-and-hr': '/interviews/03-quant-finance/derivatives',
    '/interviews/02-ai-agent/highlights': '/interviews/02-ai-agent/rag-system',
    '/interviews/03-quant-finance/highlights': '/interviews/03-quant-finance/coding-algorithms'
}

files_to_process = glob.glob('docs/**/*.md', recursive=True) + ['docs/.vitepress/config.ts', 'README.md']

for filepath in files_to_process:
    if os.path.isfile(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old_str, new_str in replacements.items():
            new_content = new_content.replace(old_str, new_str)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
