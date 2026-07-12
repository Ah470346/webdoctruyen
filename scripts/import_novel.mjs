import fs from "fs";
import path from "path";
import crypto from "crypto";

const args = process.argv.slice(2);
if (args.length < 5) {
  console.error("Usage: node import_novel.mjs <file_path> <slug> <title> <author> <genre> [status] [featured]");
  process.exit(1);
}

const [filePath, slug, title, author, genre, status = "Đang ra", featured = "true"] = args;
const absoluteFilePath = path.resolve(filePath);

if (!fs.existsSync(absoluteFilePath)) {
  console.error(`File not found: ${absoluteFilePath}`);
  process.exit(1);
}

const content = fs.readFileSync(absoluteFilePath, "utf-8");
const lines = content.split(/\r?\n/);

const chapters = [];
let currentChapter = {
  so: 0,
  title: "Lời mở đầu",
  content: []
};

// Regex to match "**Chương X:**" or "Chương 01::" or "Chương 273: title"
const chapterRegex = /^\**Chương\s+(\d+)\s*[:\.=\*]*\s*(.*)$/i;
let chapterCounter = 1;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  const match = trimmed.match(chapterRegex);
  if (match) {
    if (currentChapter && (currentChapter.content.length > 0 || currentChapter.so !== 0)) {
      chapters.push(currentChapter);
    }
    const so = chapterCounter++;
    // Remove trailing markdown bold asterisks from title if any
    let titlePart = match[2] ? match[2].trim() : "";
    titlePart = titlePart.replace(/\**$/, "").trim();
    currentChapter = {
      so,
      title: `Chương ${so}${titlePart ? `: ${titlePart}` : ""}`,
      content: []
    };
  } else if (currentChapter) {
    currentChapter.content.push(trimmed);
  }
}

if (currentChapter) {
  chapters.push(currentChapter);
}

console.log(`Parsed ${chapters.length} chapters.`);

const chaptersDir = path.join(process.cwd(), "src", "data", "chapters");
if (!fs.existsSync(chaptersDir)) {
  fs.mkdirSync(chaptersDir, { recursive: true });
}

const jsonPath = path.join(chaptersDir, `${slug}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(chapters, null, 2), "utf-8");
console.log(`Saved chapters to ${jsonPath}`);

const novelsPath = path.join(process.cwd(), "src", "data", "novels.json");
let novels = [];
if (fs.existsSync(novelsPath)) {
  try {
    novels = JSON.parse(fs.readFileSync(novelsPath, "utf-8"));
  } catch (e) {
    // ignore
  }
}

const existingIndex = novels.findIndex(n => n.slug === slug);
const novelData = {
  id: crypto.randomBytes(4).toString("hex"),
  slug,
  title,
  genre,
  author,
  image: "/images/fantasy.png",
  rating: 4.9,
  chapters: chapters.length,
  views: "1.0M",
  description: "Truyện được cập nhật tự động.",
  status,
  featured: featured === "true"
};

if (existingIndex >= 0) {
  novelData.id = novels[existingIndex].id; // preserve ID
  novels[existingIndex] = { ...novels[existingIndex], ...novelData };
  console.log(`Updated existing novel: ${slug}`);
} else {
  novels.push(novelData);
  console.log(`Added new novel: ${slug}`);
}

fs.writeFileSync(novelsPath, JSON.stringify(novels, null, 2), "utf-8");
console.log(`Saved novels to ${novelsPath}`);
