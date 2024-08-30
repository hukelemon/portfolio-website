import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const ICON_URL = "https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/icon.jpg";
const BANNER_URL = "https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/banner.png";

export const metadata: Metadata = {
  title: "You're obsessed",
  description: "Scott's portfolio - Let's work together on your next project!",
  openGraph: {
    title: "You're obsessed",
    description: "Scott's portfolio - Let's work together on your next project!",
    url: "https://www.howtohirescott.com/",
    siteName: "How to Hire Scott",
    images: [
      {
        url: BANNER_URL,
        width: 1200,
        height: 630,
        alt: "Let's work together - Scott's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "You're obsessed",
    description: "Scott's portfolio - Let's work together on your next project!",
    images: [BANNER_URL],
  },
  icons: {
    icon: ICON_URL,
    apple: ICON_URL, // Using the same icon for Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
