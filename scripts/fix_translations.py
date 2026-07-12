#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script dịch lại các chunk bị lỗi bằng Qwen 2.5 7B qua OpenRouter 
và ghi đè vào cache .translate_cache.json, sau đó ráp lại file DICH.txt hoàn chỉnh.
"""

import hashlib
import json
import os
import re
import sys
import time
import threading
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

# ============================================================
# CẤU HÌNH
# ============================================================

BASE_DIR = Path(__file__).parent.parent
SOURCE_FILE = BASE_DIR / "sources" / "Phản diện - Mẫu thân của ta là đại đế (1-147 chương kết thúc + phiên ngoại 1 + đồng nhân 1-2 chương) (thuần yêu hậu cung, mẹ con, hệ thống xuyên không).txt"
OUTPUT_FILE = BASE_DIR / "sources" / "Phản diện - Mẫu thân của ta là đại đế_DICH.txt"
CACHE_FILE = BASE_DIR / "sources" / ".translate_cache.json"

# Load bad chunks from scratch directory
BAD_CHUNKS_FILE = Path("/Users/truongdv/.gemini/antigravity-ide/brain/cb3f98f0-4d3b-42d8-ab58-086cd9300c1c/scratch/bad_chunks.json")

# API key: .env
API_KEY = ""
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    with open(ENV_FILE, "r") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip()
if not API_KEY:
    print("Error: OPENROUTER_API_KEY not found in .env")
    sys.exit(1)

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "deepseek/deepseek-chat"
MAX_WORKERS = 8  # Giảm bớt số worker để tránh rate limit của DeepSeek V3
MAX_RETRIES = 5
RETRY_DELAY = 10  # giây

SYSTEM_PROMPT = """Bạn là dịch giả chuyên nghiệp. Hãy dịch đoạn văn bản convert truyện tu tiên/sắc hiệp Trung Quốc sau sang tiếng Việt văn phong trôi chảy, mượt mà, tự nhiên nhất.

YÊU CẦU:
1. Đảo ngữ pháp các cụm từ convert bị ngược (ví dụ bổ ngữ/tính từ đứng trước danh từ phải đảo lại ra sau).
2. Giữ nguyên thuật ngữ Hán Việt (bí pháp, linh lực, thần thức, trận truyền tống, tông môn...) và tên riêng Hán Việt.
3. Dùng xưng hô cổ trang phù hợp ngữ cảnh (mẫu thân/nương - con/ta; thiếu chủ - thuộc hạ/ta; ngươi - ta...).
4. Giữ nguyên 100% nội dung sắc hiệp/18+, tuyệt đối không kiểm duyệt hay lược bỏ.
5. CHỈ TRẢ VỀ BẢN DỊCH DUY NHẤT. Không giải thích, không ghi chú, không thêm bớt bất kỳ từ ngữ nào ngoài bản dịch."""

# ============================================================
# TIỆN ÍCH
# ============================================================

_print_lock = threading.Lock()
_cache_lock = threading.Lock()

def log(msg, level="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    with _print_lock:
        print(f"[{ts}][{level}] {msg}", flush=True)

def call_openrouter(text, retry=0):
    """Gọi OpenRouter API để dịch một chunk. Có retry + backoff."""
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
        API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "HTTP-Referer": "https://github.com/google/antigravity",
            "X-Title": "Novel Translation Fixer",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
        choices = result.get("choices", [])
        if not choices:
            raise RuntimeError(f"Response rỗng từ API: {str(result)[:200]}")
        content = choices[0].get("message", {}).get("content", "").strip()
        if not content:
            raise RuntimeError("Nội dung dịch trả về rỗng")
        return content

    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        if e.code == 429 and retry < MAX_RETRIES:
            wait = 15 * (retry + 1)
            log(f"    ⏳ Chạm Rate Limit (429). Đợi {wait}s...", "WARN")
            time.sleep(wait)
            return call_openrouter(text, retry + 1)
        if retry < MAX_RETRIES:
            log(f"    ✗ Lỗi HTTP {e.code}: {body[:100]}. Thử lại sau {RETRY_DELAY}s...", "WARN")
            time.sleep(RETRY_DELAY)
            return call_openrouter(text, retry + 1)
        raise RuntimeError(f"HTTP {e.code}: {body[:200]}")
    except Exception as e:
        if retry < MAX_RETRIES:
            log(f"    ✗ Lỗi kết nối: {e}. Thử lại sau {RETRY_DELAY}s...", "WARN")
            time.sleep(RETRY_DELAY)
            return call_openrouter(text, retry + 1)
        raise

# ============================================================
# RUN & MERGE
# ============================================================

def main():
    log("BẮT ĐẦU FIX LỖI TRANSLATION")
    log(f"Model: {MODEL} | Workers: {MAX_WORKERS}")

    if not CACHE_FILE.exists():
        log(f"Không tìm thấy file cache gốc: {CACHE_FILE}", "ERROR")
        sys.exit(1)
    if not BAD_CHUNKS_FILE.exists():
        log(f"Không tìm thấy file bad_chunks.json: {BAD_CHUNKS_FILE}", "ERROR")
        sys.exit(1)

    # 1. Đọc cache hiện tại
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
    log(f"Đã load {len(cache):,} entries từ cache gốc.")

    # 2. Đọc danh sách bad chunks
    with open(BAD_CHUNKS_FILE, "r", encoding="utf-8") as f:
        bad_chunks = json.load(f)
    log(f"Đã load {len(bad_chunks):,} chunk bị lỗi từ bad_chunks.json.")

    # Lọc ra các chunk cần dịch thực sự (những chunk có raw text)
    # Deduplicate bằng hash
    todo = {}
    for item in bad_chunks:
        h = item["hash"]
        todo[h] = item["raw"]

    log(f"Số lượng chunk duy nhất cần dịch lại: {len(todo):,}")

    # 3. Dịch song song
    done = 0
    start_time = time.time()
    
    if todo:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {executor.submit(call_openrouter, raw): h for h, raw in todo.items()}
            try:
                for fut in as_completed(futures):
                    h = futures[fut]
                    try:
                        result = fut.result()
                    except Exception as e:
                        log(f"  ✗ Lỗi dịch chunk {h}: {e}", "ERROR")
                        continue

                    with _cache_lock:
                        cache[h] = result
                        done += 1
                        # Lưu cache định kỳ mỗi 10 chunk để tránh mất dữ liệu nếu bị ngắt
                        if done % 10 == 0 or done == len(todo):
                            # Save to temp and replace to be safe
                            tmp_cache = CACHE_FILE.with_suffix(".tmp")
                            with open(tmp_cache, "w", encoding="utf-8") as f_cache:
                                json.dump(cache, f_cache, ensure_ascii=False)
                            tmp_cache.replace(CACHE_FILE)
                            log(f"  ✓ Đã lưu cache. Tiến độ: {done}/{len(todo)} chunk.")

                    elapsed = time.time() - start_time
                    rate = done / elapsed if elapsed else 0
                    eta = (len(todo) - done) / rate / 60 if rate else 0
                    log(f"  ✓ {done}/{len(todo)} | {rate*60:.1f} chunk/phút | ETA {eta:.1f} phút")

            except KeyboardInterrupt:
                log("Bị dừng bởi người dùng, đang thoát...", "WARN")
                sys.exit(0)

    log("✓ Quá trình dịch lại các chunk hoàn tất. Đang ráp lại file truyện hoàn chỉnh...")

    # 4. Đọc file raw gốc và chia section tương tự như kịch bản gốc để ráp
    with open(SOURCE_FILE, "r", encoding="utf-8", errors="ignore") as f:
        raw_content = f.read().replace("\r\n", "\n").replace("\r", "\n").replace("\t", "")

    # Tách section giống deepseek script
    pattern = re.compile(r"(Chương \d+[^:]*::)", re.MULTILINE)
    matches = list(pattern.finditer(raw_content))
    sections = []
    if matches:
        header = raw_content[:matches[0].start()].strip()
        if header:
            sections.append({"type": "header", "title": "Header", "content": header})
        for i, m in enumerate(matches):
            end = matches[i + 1].start() if i + 1 < len(matches) else len(raw_content)
            ch_content = raw_content[m.start():end].strip()
            sections.append({"type": "chapter", "title": m.group(1).strip(), "content": ch_content})
    else:
        sections.append({"type": "full", "title": "Full", "content": raw_content})

    # Chunk text
    def chunk_text(text, max_chars=6000):
        if len(text) <= max_chars:
            return [text]
        parts, current, cur_len = [], [], 0
        for para in text.split("\n\n"):
            if cur_len + len(para) > max_chars and current:
                parts.append("\n\n".join(current))
                current, cur_len = [para], len(para)
            else:
                current.append(para)
                cur_len += len(para)
        if current:
            parts.append("\n\n".join(current))
        return parts

    for s in sections:
        s["chunks"] = chunk_text(s["content"], 6000)

    # Ráp lại các bản dịch từ cache
    missing = 0
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("PHẢN DIỆN: MẪU THÂN CỦA TA LÀ ĐẠI ĐẾ\n")
        f.write("Tác giả: Nhạc Phúc Không Chịu\n")
        f.write(f"Bản dịch tiếng Việt — Fix lỗi bằng DeepSeek V3 qua OpenRouter\n")
        f.write(f"Ngày cập nhật: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write("=" * 60 + "\n\n")
        
        for s in sections:
            parts = []
            for c in s["chunks"]:
                h = hashlib.md5(c.encode("utf-8")).hexdigest()
                translated = cache.get(h)
                if translated is None:
                    missing += 1
                    parts.append(f"[LỖI - CHƯA DỊCH]\n{c}")
                else:
                    parts.append(translated)
            f.write("\n\n".join(parts) + "\n\n")

    print("\n" + "=" * 60)
    if missing == 0:
        log(f"✓ HOÀN THÀNH RÁP TRUYỆN! File dịch mới: {OUTPUT_FILE}")
    else:
        log(f"Cảnh báo: Có {missing} chunk bị thiếu bản dịch. Vui lòng kiểm tra lại cache.", "WARN")
    print("=" * 60)

if __name__ == "__main__":
    main()
