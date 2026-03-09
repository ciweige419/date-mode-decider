import "./globals.css";

export const metadata = {
  title: "约会模式决策器",
  description: "帮你判断这次约会更适合什么约会形式。"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
