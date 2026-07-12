import sys
import os
from pathlib import Path
sys.path.append(os.path.join(os.getcwd(), 'scripts'))
from translate_novel_deepseek import call_deepseek, chunk_text, API_KEY

if not API_KEY:
    print("API_KEY not set")
    sys.exit(1)

with open("sources/test_chapter2_raw.txt", "r", encoding="utf-8") as f:
    text = f.read()

chunks = chunk_text(text, 3000)
translated_chunks = []
for i, c in enumerate(chunks):
    print(f"Translating chunk {i+1}/{len(chunks)} (length: {len(c)})...")
    res = call_deepseek(c)
    translated_chunks.append(res)

with open("testchuong2.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(translated_chunks))
print("Done. Saved to testchuong2.txt")
