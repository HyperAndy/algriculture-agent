import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大田作物稳产减灾决策Agent",
  description: "面向水稻、小麦、玉米、大豆的精准农事管理系统"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
