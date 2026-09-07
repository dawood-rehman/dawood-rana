import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeScript from "./components/ThemeScript";
import { AdminProvider } from "./context/AdminContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dawoodrana.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dawood Rehman | Full-Stack Developer & Software Engineer",
    template: "%s | Dawood Rehman",
  },
  description: "Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications, modern APIs, and cloud services.",
  keywords: [
    "Dawood Rehman",
    "Dawood Rana",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js Developer",
    "React Developer",
    "Node.js",
    "Portfolio"
  ],
  authors: [{ name: "Dawood Rehman", url: siteUrl }],
  creator: "Dawood Rehman",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Dawood Rehman | Full-Stack Developer & Software Engineer",
    description: "Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in modern web development.",
    url: siteUrl,
    siteName: "Dawood Rehman Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dawood Rehman | Full-Stack Developer & Software Engineer",
    description: "Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer.",
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dawood Rehman',
  alternateName: 'Dawood Rana',
  jobTitle: 'Full-Stack Developer & Software Engineer',
  url: siteUrl,
  sameAs: [
    'https://github.com/dawood-rehman',
    'https://linkedin.com/in/dawood-rehman'
  ],
  description: 'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--surface-strong)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
                },
              }}
            />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
