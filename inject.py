import re
import sys
import json

def inject_answers(file_path, json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        qa_dict = json.load(f)
        
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        new_lines.append(line)
        m = re.match(r'^-\s+(.+)$', line)
        if m:
            q = m.group(1).strip()
            # Find matching answer
            for k, v in qa_dict.items():
                if k in q:
                    answer_lines = v.strip().split('\n')
                    for ans_line in answer_lines:
                        if ans_line.strip():
                            new_lines.append(f"  > **回答思路：** {ans_line}\n")
                        else:
                            new_lines.append("\n")
                    new_lines.append("\n")
                    # Remove the key so we don't inject twice if there are similar questions? 
                    # No, some questions might be identical in different parts, but we assume keys are specific enough.
                    break
                    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Injected {len(qa_dict)} answers into {file_path}")

if __name__ == "__main__":
    inject_answers(sys.argv[1], sys.argv[2])
