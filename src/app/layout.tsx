import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Web Đọc Truyện - Đọc Truyện Online Miễn Phí Chất Lượng Cao",
  description: "Trang web đọc truyện chữ online chất lượng cao với các thể loại tiên hiệp, huyền huyễn, đô thị, ngôn tình, dã sử, kiếm hiệp mới nhất, cập nhật liên tục.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

const NO_FLASH_THEME_SCRIPT = `
try {
  var prefs = JSON.parse(localStorage.getItem('reader-prefs'));
  if (prefs && prefs.theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
