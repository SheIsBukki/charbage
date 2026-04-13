import "highlight.js/styles/shades-of-purple.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import MainNav from "@/app/ui/MainNav";
import { getCurrentSession } from "@/lib/session";
import { getProfileWithSlug } from "@/db/queries/select";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { template: "%s | Charbage", default: "Charbage" },
  description: "Charbage blog app—Charbage in, Charbage out",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  const { profile } = await getProfileWithSlug(`@${user?.username}`);

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Define isSpace function globally to fix markdown-it issues with Next.js + Turbopack */}
        <Script id="markdown-it-fix" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
              };
            }
          `}
        </Script>
        <meta name="color-scheme" content="dqrk light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative h-full antialiased`}
      >
        <ThemeProvider>
          <nav className="boder fixed left-0 right-0 top-0 z-50 w-full border-red-500">
            <MainNav profile={profile} user={user} />
          </nav>
          <main className="brder h-full border-red-500 pt-[3.6rem]">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
