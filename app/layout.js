import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "TheAlgoman - Algorithmic Trading Platform",
  description:
    "India's most trusted algo trading platform. Accelerate your profits with fully automated, data-driven strategies.",
  keywords:
    "algorithmic trading, algo trading, automated trading, India, trading platform",
  authors: [{ name: "TheAlgoman" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f172a",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
