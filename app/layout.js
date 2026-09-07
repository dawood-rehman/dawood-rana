import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeScript from "./components/ThemeScript";
import { AdminProvider } from "./context/AdminContext";
import { Toaster } from "react-hot-toast";
import { getPortfolioContent } from "@/lib/serverContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const content = await getPortfolioContent();
  const seo = content.seoConfig || {};
  const siteUrl = seo.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://dawoodrana.com';

  const keywordsArray =
    typeof seo.keywords === 'string'
      ? seo.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : Array.isArray(seo.keywords)
      ? seo.keywords
      : [
          'Dawood Rehman',
          'Dawood Rana',
          'Full-Stack Developer',
          'Software Engineer',
          'Next.js Developer',
          'React Developer',
          'Node.js',
          'Portfolio',
        ];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.siteTitle || 'Dawood Rehman | Full-Stack Developer & Software Engineer',
      template: '%s | Dawood Rehman',
    },
    description:
      seo.metaDescription ||
      'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications, modern APIs, and cloud services.',
    keywords: keywordsArray,
    authors: [{ name: seo.author || 'Dawood Rehman', url: siteUrl }],
    creator: seo.author || 'Dawood Rehman',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: seo.ogTitle || seo.siteTitle || 'Dawood Rehman | Full-Stack Developer & Software Engineer',
      description:
        seo.ogDescription ||
        seo.metaDescription ||
        'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in modern web development.',
      url: siteUrl,
      siteName: 'Dawood Rehman Portfolio',
      locale: 'en_US',
      type: seo.ogType || 'website',
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.twitterTitle || seo.siteTitle || 'Dawood Rehman | Full-Stack Developer & Software Engineer',
      description:
        seo.twitterDescription ||
        seo.metaDescription ||
        'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer.',
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
      googleBot: {
        index: seo.robotsIndex !== false,
        follow: seo.robotsFollow !== false,
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
}

export default async function RootLayout({ children }) {
  const content = await getPortfolioContent();
  const seo = content.seoConfig || {};
  const personal = content.personalInfo || {};
  const siteUrl = seo.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://dawoodrana.com';

  const sameAsList = (content.socialLinks || [])
    .map((s) => s.url)
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personal.name || 'Dawood Rehman',
    alternateName: 'Dawood Rana',
    jobTitle: personal.title || 'Full-Stack Developer & Software Engineer',
    url: siteUrl,
    sameAs: sameAsList.length > 0 ? sameAsList : [
      'https://github.com/dawood-rehman',
      'https://linkedin.com/in/dawood-rehman',
    ],
    email:
      content.contactInfo?.find((c) => c.label?.toLowerCase().includes('email'))?.value ||
      'rd535328@gmail.com',
    telephone:
      content.contactInfo?.find(
        (c) => c.label?.toLowerCase().includes('phone') || c.label?.toLowerCase().includes('whatsapp')
      )?.value || '+92 314 4885177',
    address:
      content.contactInfo?.find(
        (c) => c.label?.toLowerCase().includes('location') || c.label?.toLowerCase().includes('address')
      )?.value || 'Faisalabad, Pakistan',
    description:
      personal.bio ||
      seo.metaDescription ||
      'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications.',
  };

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
