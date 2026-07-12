import json
import os
import urllib.request
import urllib.error
from pathlib import Path

# Paths
base_dir = Path(__file__).parent.parent
env_file = base_dir / ".env"
bad_chunks_file = base_dir / ".agents" / "bad_chunks.json" # wait, we saved it to antigravity-ide/brain/scratch or .agents?
# Let's use the absolute path of bad_chunks.json we generated in antigravity-ide/brain
bad_chunks_path = Path("/Users/truongdv/.gemini/antigravity-ide/brain/cb3f98f0-4d3b-42d8-ab58-086cd9300c1c/scratch/bad_chunks.json")

# 1. Load API Key
api_key = ""
if env_file.exists():
    with open(env_file, "r") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                api_key = line.split("=", 1)[1].strip()

if not api_key:
    print("Error: OPENROUTER_API_KEY not found in .env")
    exit(1)

# 2. Load bad chunks
with open(bad_chunks_path, "r", encoding="utf-8") as f:
    bad_chunks = json.load(f)

# Select two bad chunks for testing
# We look for the first actual chapter chunk (skip header if it's the header)
test_chunks = []
for chunk in bad_chunks:
    if "Chương 01::" in chunk["chapter"]:
        test_chunks.append(chunk)
        if len(test_chunks) == 2:
            break

# If not enough Chapter 1, just take first 2
if len(test_chunks) < 2:
    test_chunks = bad_chunks[:2]

# 3. Translation logic using OpenRouter
MODEL = "qwen/qwen-2.5-7b-instruct"
SYSTEM_PROMPT = """Bạn là dịch giả chuyên nghiệp. Hãy dịch đoạn văn bản convert truyện tu tiên/sắc hiệp Trung Quốc sau sang tiếng Việt văn phong trôi chảy, mượt mà, tự nhiên nhất.

YÊU CẦU:
1. Đảo ngữ pháp các cụm từ convert bị ngược (ví dụ bổ ngữ/tính từ đứng trước danh từ phải đảo lại ra sau).
2. Giữ nguyên thuật ngữ Hán Việt (bí pháp, linh lực, thần thức, trận truyền tống, tông môn...) và tên riêng Hán Việt.
3. Dùng xưng hô cổ trang phù hợp ngữ cảnh (mẫu thân/nương - con/ta; thiếu chủ - thuộc hạ/ta; ngươi - ta...).
4. Giữ nguyên 100% nội dung sắc hiệp/18+, tuyệt đối không kiểm duyệt hay lược bỏ.
5. CHỈ TRẢ VỀ BẢN DỊCH DUY NHẤT. Không giải thích, không ghi chú, không thêm bớt bất kỳ từ ngữ nào ngoài bản dịch."""

def translate(text):
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Dịch văn bản sau:\n\n{text}"},
        ],
        "temperature": 0.3,
        "max_tokens": 4000,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://github.com/google/antigravity",
            "X-Title": "Novel Translator Test",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
        choices = result.get("choices", [])
        if choices:
            return choices[0].get("message", {}).get("content", "").strip()
        return "Error: Empty response"
    except Exception as e:
        return f"Error: {e}"

# 4. Run translation and save comparison
output_file = base_dir / "sources" / "test_hermes_translation.txt"
with open(output_file, "w", encoding="utf-8") as out:
    out.write("BẢN DỊCH THỬ NGHIỆM BẰNG NOUSRESEARCH/HERMES-3-LLAMA-3-8B\n")
    out.write("="*80 + "\n\n")

    for i, chunk in enumerate(test_chunks):
        print(f"Translating chunk {i+1} ({chunk['chapter']})...")
        translated_hermes = translate(chunk["raw"])
        
        comparison = f"""=== CHUNK {i+1}: {chunk['chapter']} (Index {chunk['chunk_index']}) ===

--- RAW CONVERT ---
{chunk['raw']}

--- DEEPSEEK TRANSLATION (WITH ERRORS) ---
{chunk['translated']}

--- HERMES-3 TRANSLATION (NEW) ---
{translated_hermes}

{"="*80}
"""
        out.write(comparison)
        print(f"Chunk {i+1} completed.")

print(f"\nDone! Comparison saved to {output_file}")
