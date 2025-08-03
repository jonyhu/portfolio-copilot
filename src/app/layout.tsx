import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Copilot - Your Investment Thinking Partner",
  description: "Think deeper about your investment thesis. Get a second opinion on your portfolio alignment, challenge your assumptions, and validate your macro views with AI-powered analysis.",
  keywords: "portfolio analysis, investment thinking, macro views, investment copilot, portfolio alignment, investment validation, AI analysis, long-term investing",
  authors: [{ name: "Portfolio Copilot" }],
  creator: "Portfolio Copilot",
  publisher: "Portfolio Copilot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portfolio-copilot.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Portfolio Copilot - Your Investment Thinking Partner",
    description: "Think deeper about your investment thesis. Get a second opinion on your portfolio alignment and validate your macro views.",
    url: 'https://portfolio-copilot.vercel.app',
    siteName: 'Portfolio Copilot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Portfolio Copilot - Your Investment Thinking Partner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Portfolio Copilot - Your Investment Thinking Partner",
    description: "Think deeper about your investment thesis. Get a second opinion on your portfolio alignment and validate your macro views.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
