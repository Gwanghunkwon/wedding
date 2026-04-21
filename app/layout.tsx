import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Wedding + Interior Cost Compass",
  description: "예식장/인테리어 비용 비교 SaaS MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="container" style={{ paddingBottom: 8 }}>
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Cost Compass</strong>
            <nav style={{ display: "flex", gap: 14 }}>
              <Link href="/">홈</Link>
              <Link href="/project">내 프로젝트</Link>
              <Link href="/wedding">웨딩 비교</Link>
              <Link href="/interior">인테리어 비교</Link>
              <Link href="/b2b">업체 콘솔</Link>
              <Link href="/admin">운영 콘솔</Link>
              <Link href="/login">로그인</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
