import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroDay: The Cyber War Simulator",
  description: "A real-time browser-based cybersecurity strategy game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
