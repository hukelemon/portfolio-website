import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const S3_BASE_URL = "https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/";
const ICON_URL_32 = `${S3_BASE_URL}icon-32x32.png`;
const ICON_URL_16 = `${S3_BASE_URL}icon-16x16.png`;
const ICON_URL_180 = `${S3_BASE_URL}icon-180x180.png`;
const ICON_URL_ICO = `${S3_BASE_URL}favicon.ico`;
const BANNER_URL = `${S3_BASE_URL}banner.png`;

export const metadata: Metadata = {
  title: "Scott's Portfolio",
  description: "Scott's portfolio - Let's work together on your next project!",
  openGraph: {
    title: "Scott's Portfolio",
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
    title: "Scott's Portfolio",
    description: "Scott's portfolio - Let's work together on your next project!",
    images: [BANNER_URL],
  },
  icons: {
    icon: [
      { url: ICON_URL_16, sizes: '16x16', type: 'image/png' },
      { url: ICON_URL_32, sizes: '32x32', type: 'image/png' },
      { url: ICON_URL_ICO, sizes: '48x48', type: 'image/x-icon' },
    ],
    apple: [
      { url: ICON_URL_180, sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: ICON_URL_ICO }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href={ICON_URL_ICO} />
        <link rel="icon" href={ICON_URL_ICO} sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
