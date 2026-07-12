import sys
import os
from translate_novel_deepseek import chunk_text

# Load SKILL rules
with open("SKILL-translate-convert.md", "r", encoding="utf-8") as f:
    skill_content = f.read()
    
# Extract rules to append to prompt
start_idx = skill_content.find("## 2. Các Lỗi Phổ Biến Trong Bản Convert & Cách Sửa")
end_idx = skill_content.find("## 4. Quy Trình Dịch")
if start_idx != -1 and end_idx != -1:
    skill_rules = skill_content[start_idx:end_idx]
else:
    skill_rules = ""

print(f"Extracted {len(skill_rules)} chars of rules")
