"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NovelCard } from "@/components/NovelCard";
import { filterNovels, getFeaturedNovel, getGenreSlug, getGenres } from "@/lib/data";
import { useLibrary } from "@/lib/useLibrary";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const { toggleBookmark, isBookmarked, getProgress } = useLibrary();

  useEffect(() => {
    // One-time sync from the URL (external to React) on mount: SSR/first paint
    // renders "", matching this effect firing after hydration - no flicker.
    const q = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setSearchQuery(q);
  }, []);

  const featuredNovel = getFeaturedNovel();
  const genres = useMemo(() => getGenres(), []);
  const filteredNovels = useMemo(
    () => filterNovels(searchQuery, selectedGenre),
    [searchQuery, selectedGenre]
  );

  const rankedNovels = useMemo(
    () =>
      [...filterNovels("", "Tất cả")]
        .slice(0, 5)
        .sort((a, b) => b.views.localeCompare(a.views)),
    []
  );

  const featuredProgress = getProgress(featuredNovel.slug);
  const heroChapterHref = `/truyen/${featuredNovel.slug}/chuong/${featuredProgress?.chapterSo ?? 1}`;

  return (
    <>
      <Header searchValue={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Featured Novel */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div className="hero-banner">
            <div className="hero-content">
              <span className="badge-featured">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "2px" }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Truyện Nổi Bật
              </span>
              <h1 className="hero-title">{featuredNovel.title}</h1>
              <div className="hero-meta">
                <div className="meta-item rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{featuredNovel.rating}</span>
                </div>
                <div className="divider"></div>
                <div className="meta-item">
                  <span>Tác giả: {featuredNovel.author}</span>
                </div>
                <div className="divider"></div>
                <div className="meta-item">
                  <span>Thể loại: {featuredNovel.genre}</span>
                </div>
                <div className="divider"></div>
                <div className="meta-item">
                  <span>{featuredNovel.chapters} Chương</span>
                </div>
              </div>
              <p className="hero-desc">{featuredNovel.description}</p>
              <div className="hero-ctas">
                <Link href={heroChapterHref} className="btn-primary">
                  {featuredProgress ? "Đọc Tiếp" : "Đọc Ngay"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <button
                  className="btn-secondary"
                  onClick={() => toggleBookmark(featuredNovel.slug)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isBookmarked(featuredNovel.slug) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      color: isBookmarked(featuredNovel.slug)
                        ? "var(--accent-primary)"
                        : "inherit",
                    }}
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {isBookmarked(featuredNovel.slug) ? "Đã Lưu" : "Lưu Vào Tủ Sách"}
                </button>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <Image
                src={featuredNovel.image}
                alt={`Bìa truyện ${featuredNovel.title}`}
                width={260}
                height={390}
                className="hero-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="container">
        <div className="home-layout">
          {/* Left Column: Grid list with filtering */}
          <div className="home-main">
            <div className="section-header" id="the-loai">
              <h2 className="section-title">Danh Sách Truyện</h2>
              <div className="genre-filter">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`genre-chip${selectedGenre === genre ? " active" : ""}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {filteredNovels.length === 0 ? (
              <div
                style={{
                  padding: "60px 0",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Không tìm thấy truyện nào khớp với bộ lọc.
              </div>
            ) : (
              <div className="novels-grid">
                {filteredNovels.map((novel) => (
                  <NovelCard
                    key={novel.id}
                    novel={novel}
                    isBookmarked={isBookmarked(novel.slug)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Rankings */}
          <aside className="sidebar" id="xep-hang">
            <div>
              <div className="section-header" style={{ marginBottom: "20px" }}>
                <h2 className="section-title">Xem Nhiều Nhất</h2>
              </div>
              <div className="ranking-list">
                {rankedNovels.map((novel, index) => (
                  <Link
                    key={novel.id}
                    href={`/truyen/${novel.slug}`}
                    className="ranking-item"
                  >
                    <span className={`rank-number rank-${index + 1}`}>
                      {index + 1}
                    </span>
                    <Image
                      src={novel.image}
                      alt={`Bìa ${novel.title}`}
                      width={48}
                      height={64}
                      className="rank-cover"
                    />
                    <div className="rank-details">
                      <h4 className="rank-title">{novel.title}</h4>
                      <div className="rank-meta">
                        <span className="badge-tag">{novel.genre}</span>
                        <span>{novel.views} xem</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick reading section */}
            <div className="highlight-box">
              <h3 style={{ fontSize: "16px", marginBottom: "12px", fontWeight: "700" }}>
                🎯 Gợi Ý Hôm Nay
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Hệ thống dựa trên thói quen đọc truyện của bạn để gợi ý tác phẩm phù hợp nhất.
                Nhấn vào &ldquo;Đọc Ngay&rdquo; trên banner nổi bật để khám phá câu chuyện yêu thích!
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <div className="logo-container">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="url(#logoGrad2)" />
                  <path
                    d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V12Z"
                    fill="white"
                    fillOpacity="0.2"
                  />
                  <path d="M11 11H21V13H11V11ZM11 15H21V17H11V15ZM11 19H17V21H11V19Z" fill="white" />
                  <defs>
                    <linearGradient id="logoGrad2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ff6b4a" />
                      <stop offset="1" stopColor="#ff8e53" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="logo-text">WebĐọcTruyện</span>
              </div>
              <p className="footer-desc">
                Cung cấp nền tảng đọc truyện trực tuyến miễn phí và cập nhật nhanh nhất.
                Sứ mệnh mang lại trải nghiệm đọc truyện tuyệt vời cho độc giả Việt Nam.
              </p>
            </div>
            <div className="footer-links-col">
              <h4 className="footer-title">Khám Phá</h4>
              <ul className="footer-links">
                <li><Link href={`/the-loai/${getGenreSlug("Tiên Hiệp")}`} className="footer-link">Tiên Hiệp</Link></li>
                <li><Link href={`/the-loai/${getGenreSlug("Ngôn Tình")}`} className="footer-link">Ngôn Tình</Link></li>
                <li><Link href={`/the-loai/${getGenreSlug("Huyền Huyễn")}`} className="footer-link">Huyền Huyễn</Link></li>
                <li><Link href={`/the-loai/${getGenreSlug("Khoa Huyễn")}`} className="footer-link">Khoa Huyễn</Link></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4 className="footer-title">Hỗ Trợ</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Điều Khoản Sử Dụng</a></li>
                <li><a href="#" className="footer-link">Chính Sách Bảo Mật</a></li>
                <li><a href="#" className="footer-link">Báo Lỗi Bản Quyền</a></li>
                <li><a href="#" className="footer-link">Liên Hệ Hợp Tác</a></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4 className="footer-title">Cộng Đồng</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Diễn Đàn Độc Giả</a></li>
                <li><a href="#" className="footer-link">Group Facebook</a></li>
                <li><a href="#" className="footer-link">Kênh Discord</a></li>
                <li><a href="#" className="footer-link">Fanpage Cập Nhật</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 WebĐọcTruyện. All rights reserved.</p>
            <p>Made with ❤️ for Web Novel Readers</p>
          </div>
        </div>
      </footer>
    </>
  );
}
