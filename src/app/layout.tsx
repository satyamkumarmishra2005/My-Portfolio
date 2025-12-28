import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteMetadata } from "@/data/content";
import { ThemeProvider } from "@/contexts/ThemeContext";

/**
 * Font optimization using next/font/local
 * Fonts are automatically optimized and self-hosted
 * Requirements: 9.1
 */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Ensure text remains visible during font load
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

/**
 * SEO Metadata configuration
 * Requirements: 10.2, 10.4
 */
export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: [
    "backend engineer",
    "platform engineer",
    "software engineer",
    "distributed systems",
    "microservices",
    "APIs",
    "cloud infrastructure",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Redis",
    "Docker",
    "AWS",
  ],
  authors: [{ name: "John Doe" }],
  creator: "John Doe",
  metadataBase: new URL(siteMetadata.siteUrl),
  // Open Graph meta tags for social sharing (Requirement 10.4)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
  },
  // Twitter Card meta tags
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root Layout Component
 * Configures fonts, global styles, and HTML structure
 * Optimized for performance with font preloading and display swap
 * Requirements: 9.1, 10.2, 10.4
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(theme);
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* DNS prefetch for external resources if any */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        {/* Preconnect for faster resource loading */}
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
