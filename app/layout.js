import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
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

export const metadata = {
  title: "Dawood Rehman - Portfolio",
  description: "Portfolio website of Dawood Rehman - Computer Science Student and Full-Stack Developer",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
              }}
            />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
