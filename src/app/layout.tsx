import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro Timer App",
  description: "AI-powered Pomodoro timer with Linear integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex gap-4">
            <a href="/" className="hover:text-gray-300">
              ホーム
            </a>
            <a href="/calendar" className="hover:text-gray-300">
              カレンダー
            </a>
            <a href="/settings" className="hover:text-gray-300">
              設定
            </a>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
