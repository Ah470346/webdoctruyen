#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script dịch truyện convert Trung → Việt bằng OpenRouter API.

TỐI ƯU TỐC ĐỘ (giống bản deepseek):
  - Gom TẤT CẢ chunk của mọi chương thành 1 hàng đợi phẳng và dịch SONG SONG toàn bộ.
  - Cache từng chunk theo hash nội dung → chạy lại chỉ dịch phần còn thiếu.
  - Ráp lại đúng thứ tự và ghi output idempotent.

MODEL: mặc định deepseek/deepseek-chat (rẻ & tốt cho dịch). Đổi qua biến môi trường DS_MODEL,
  ví dụ: qwen/qwen3-30b-a3b-instruct-2507, google/gemini-2.0-flash-001, ...
  Lưu ý: OpenRouter có rate limit phụ thuộc số credit → nếu bị 429 nhiều thì giảm DS_WORKERS.

Cách dùng:
    OPENROUTER_API_KEY=your_key python3 scripts/translate_novel_openrouter.py
    # hoặc đặt OPENROUTER_API_KEY trong file .env ở gốc project

Tuỳ chọn qua biến môi trường:
    DS_WORKERS=10      # số luồng song song (mặc định 10)
    DS_CHUNK=6000      # số ký tự mỗi chunk (mặc định 6000)
    DS_MODEL=deepseek/deepseek-chat
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
SOURCE_FILE = BASE_DIR / "sources" / "Phản diện - Mẫu thân của ta là đại đế (1-147 chương kết thúc + phiên ngoại 1 + đồng nhân 1-2 chương) (thuần yêu hậu cung, mẹ con, hệ thống xuyên không).txt"
OUTPUT_FILE = BASE_DIR / "sources" / "Phản diện - Mẫu thân của ta là đại đế_DICH.txt"
CACHE_FILE = BASE_DIR / "sources" / ".translate_cache_openrouter.json"

# API key: ưu tiên .env rồi tới biến môi trường
API_KEY = ""
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    with open(ENV_FILE, "r") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip()
if not API_KEY:
    API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.environ.get("DS_MODEL", "deepseek/deepseek-chat")

# Chunk nhỏ hơn = nhiều request hơn nhưng song song nhiều hơn → nhanh hơn tổng thể,
# và tránh rủi ro bản dịch vượt max_tokens bị cắt cụt.
CHUNK_SIZE = int(os.environ.get("DS_CHUNK", "6000"))

# Số luồng song song. OpenRouter có rate limit theo credit; 10 an toàn, tăng nếu không bị 429.
MAX_WORKERS = int(os.environ.get("DS_WORKERS", "10"))

MAX_TOKENS = 8000
TEMPERATURE = float(os.environ.get("DS_TEMP", "1.3"))

MAX_RETRIES = 4
RETRY_DELAY = 8  # giây

# ============================================================
# SYSTEM PROMPT
# ============================================================

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


def log(msg, level="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    with _print_lock:
        print(f"[{ts}][{level}] {msg}", flush=True)


def chunk_key(text):
    """Khoá cache ổn định theo nội dung → resilient khi đổi thứ tự / chạy lại."""
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def call_openrouter(text, retry=0):
    """Gọi OpenRouter API để dịch một chunk. Có retry + backoff."""
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Dịch văn bản sau:\n\n{text}"},
        ],
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
    }).encode("utf-8")

    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "HTTP-Referer": "https://github.com/google/antigravity",  # Required by OpenRouter
            "X-Title": "Novel Translator",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            result = json.loads(resp.read())
        choices = result.get("choices", [])
        if not choices:
            raise RuntimeError(f"Response rỗng: {str(result)[:200]}")
        msg = choices[0].get("message", {})
        finish = choices[0].get("finish_reason")
        content = msg.get("content", "").strip()
        if finish == "length":
            log(f"    ⚠ Bản dịch có thể bị cắt (finish_reason=length). Giảm DS_CHUNK.", "WARN")
        if not content:
            raise RuntimeError("Nội dung dịch rỗng")
        return content

    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        if e.code == 429 and retry < MAX_RETRIES:
            wait = 10 * (retry + 1)
            log(f"    ⏳ Rate limited (429). Đợi {wait}s...", "WARN")
            time.sleep(wait)
            return call_openrouter(text, retry + 1)
        if retry < MAX_RETRIES:
            log(f"    ✗ HTTP {e.code}: {body[:120]}. Thử lại...", "WARN")
            time.sleep(RETRY_DELAY)
            return call_openrouter(text, retry + 1)
        raise RuntimeError(f"HTTP {e.code}: {body[:200]}")
    except Exception as e:
        if retry < MAX_RETRIES:
            log(f"    ✗ Lỗi: {e}. Thử lại...", "WARN")
            time.sleep(RETRY_DELAY)
            return call_openrouter(text, retry + 1)
        raise


def split_into_sections(content):
    """Chia file thành header + từng chương."""
    pattern = re.compile(r'(Chương \d+[^:]*::)', re.MULTILINE)
    matches = list(pattern.finditer(content))
    sections = []

    if matches:
        header = content[:matches[0].start()].strip()
        if header:
            sections.append({"type": "header", "title": "Header", "content": header})
        for i, m in enumerate(matches):
            end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
            ch_content = content[m.start():end].strip()
            sections.append({"type": "chapter", "title": m.group(1).strip(), "content": ch_content})
    else:
        sections.append({"type": "full", "title": "Full", "content": content})
    return sections


def chunk_text(text, max_chars=CHUNK_SIZE):
    """Chia đoạn lớn thành các chunk nhỏ theo ranh giới đoạn văn."""
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


def load_cache():
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            log("Cache hỏng, bỏ qua.", "WARN")
    return {}


def save_cache(cache):
    tmp = CACHE_FILE.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False)
    tmp.replace(CACHE_FILE)


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 60)
    print("  DỊCH TRUYỆN CONVERT TRUNG → VIỆT (OpenRouter — song song)")
    print("=" * 60)

    if not API_KEY:
        log("OPENROUTER_API_KEY chưa được set!", "ERROR")
        print("\n  OPENROUTER_API_KEY=sk-xxxx python3 scripts/translate_novel_openrouter.py")
        sys.exit(1)
    if not SOURCE_FILE.exists():
        log(f"Không tìm thấy: {SOURCE_FILE}", "ERROR")
        sys.exit(1)

    log(f"Model: {MODEL} | Workers: {MAX_WORKERS} | Chunk: {CHUNK_SIZE:,} ký tự")

    # 1. Đọc & làm sạch
    with open(SOURCE_FILE, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    content = content.replace("\r\n", "\n").replace("\r", "\n").replace("\t", "")
    log(f"File: {len(content):,} ký tự")

    # 2. Tách section rồi tách thành hàng đợi chunk phẳng
    sections = split_into_sections(content)
    total_ch = sum(1 for s in sections if s["type"] == "chapter")
    for s in sections:
        s["chunks"] = chunk_text(s["content"], CHUNK_SIZE)

    all_chunks = []  # danh sách text các chunk cần dịch (dedupe theo hash)
    seen = set()
    for s in sections:
        for c in s["chunks"]:
            k = chunk_key(c)
            if k not in seen:
                seen.add(k)
                all_chunks.append(c)
    log(f"Cấu trúc: {len(sections)} section ({total_ch} chương) | {len(all_chunks)} chunk duy nhất")

    # 3. Cache + xác định chunk còn thiếu
    cache = load_cache()
    todo = [c for c in all_chunks if chunk_key(c) not in cache]
    log(f"Đã có trong cache: {len(all_chunks) - len(todo)} | Cần dịch: {len(todo)}")

    # 4. Dịch song song toàn bộ chunk còn thiếu
    if todo:
        done = 0
        start = time.time()
        cache_lock = threading.Lock()
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
            futures = {ex.submit(call_openrouter, c): c for c in todo}
            try:
                for fut in as_completed(futures):
                    chunk = futures[fut]
                    try:
                        result = fut.result()
                    except Exception as e:
                        log(f"  ✗ Chunk lỗi (bỏ qua, chạy lại sau): {e}", "ERROR")
                        continue
                    with cache_lock:
                        cache[chunk_key(chunk)] = result
                        done += 1
                        if done % 10 == 0 or done == len(todo):
                            save_cache(cache)
                    elapsed = time.time() - start
                    rate = done / elapsed if elapsed else 0
                    eta = (len(todo) - done) / rate / 60 if rate else 0
                    log(f"  ✓ {done}/{len(todo)} chunk | {rate*60:.0f} chunk/phút | ETA {eta:.0f} phút")
            except KeyboardInterrupt:
                log("Dừng bởi người dùng — lưu cache...", "WARN")
                with cache_lock:
                    save_cache(cache)
                sys.exit(0)
        save_cache(cache)

    # 5. Ráp lại đúng thứ tự & ghi output (idempotent)
    missing = 0
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("PHẢN DIỆN: MẪU THÂN CỦA TA LÀ ĐẠI ĐẾ\n")
        f.write("Tác giả: Nhạc Phúc Không Chịu\n")
        f.write(f"Bản dịch tiếng Việt — OpenRouter ({MODEL})\n")
        f.write(f"Ngày dịch: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write("=" * 60 + "\n\n")
        for s in sections:
            parts = []
            for c in s["chunks"]:
                translated = cache.get(chunk_key(c))
                if translated is None:
                    missing += 1
                    parts.append(f"[LỖI - CHƯA DỊCH]\n{c}")
                else:
                    parts.append(translated)
            f.write("\n\n".join(parts) + "\n\n")

    print("\n" + "=" * 60)
    if missing == 0:
        log(f"✓ HOÀN THÀNH! File dịch: {OUTPUT_FILE}")
        log("Cache giữ lại để dùng nếu cần ráp lại. Xoá .translate_cache_openrouter.json nếu muốn.")
    else:
        log(f"Còn {missing} chunk chưa dịch (lỗi). Chạy lại script để dịch nốt.", "WARN")
    print("=" * 60)


if __name__ == "__main__":
    main()
