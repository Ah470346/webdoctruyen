"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLibrary } from "@/lib/useLibrary";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { bookmarks } = useLibrary();
  const [localSearch, setLocalSearch] = useState("");

  const isControlled = searchValue !== undefined && onSearchChange !== undefined;
  const inputValue = isControlled ? searchValue : localSearch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isControlled) {
      router.push(`/?q=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <header className="header">
      <div className="container navbar">
        <Link href="/" className="logo-container">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
            <path
              d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V12Z"
              fill="white"
              fillOpacity="0.2"
            />
            <path
              d="M11 11H21V13H11V11ZM11 15H21V17H11V15ZM11 19H17V21H11V19Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="logoGrad"
                x1="0"
                y1="0"
                x2="32"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ff6b4a" />
                <stop offset="1" stopColor="#ff8e53" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">WebĐọcTruyện</span>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link href="/" className={`nav-link${pathname === "/" ? " active" : ""}`}>
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link href="/#the-loai" className="nav-link">
              Thể Loại
            </Link>
          </li>
          <li>
            <Link href="/#xep-hang" className="nav-link">
              Bảng Xếp Hạng
            </Link>
          </li>
          <li>
            <Link
              href="/tu-sach"
              className={`nav-link${pathname === "/tu-sach" ? " active" : ""}`}
            >
              Lịch Sử
            </Link>
          </li>
        </ul>

        <form className="search-box" id="search" onSubmit={handleSubmit}>
          <button type="submit" className="search-icon-btn" aria-label="Tìm kiếm">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm truyện hoặc tác giả..."
            className="search-input"
            value={inputValue}
            onChange={(e) =>
              isControlled ? onSearchChange!(e.target.value) : setLocalSearch(e.target.value)
            }
          />
        </form>

        <div className="nav-actions">
          <Link href="/tu-sach" className="btn-icon" title="Tủ Sách" style={{ position: "relative" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {bookmarks.length > 0 && (
              <span className="bookmark-badge">{bookmarks.length}</span>
            )}
          </Link>
          <Image
            src="/images/fantasy.png"
            alt="User profile picture"
            width={42}
            height={42}
            className="avatar"
          />
        </div>
      </div>
    </header>
  );
}
