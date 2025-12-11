import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catarium",
  description: "Информационно-аналитическая платформа",
};

/**
 * Defines the application's root HTML layout and global providers.
 *
 * Configures document language, global fonts, React Query and theme providers, and renders the supplied children as the page content.
 *
 * @param children - The content to render inside the root layout.
 * @returns A React element representing the document root with fonts, theme, and React Query providers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
      >
        {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}