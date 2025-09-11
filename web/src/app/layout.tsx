import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SpaceBackgroundWrapper from '@/components/SpaceBackgroundWrapper';
import GlobalNavbar from '@/components/GlobalNavbar';
import GamificationSystem from '@/components/GamificationSystem';

const inter = Inter({
  variable: "--font-space",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-space",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ISS Crew Health Analysis | NASA LSDA Data Insights',
  description: 'Comprehensive analysis of International Space Station crew health data using NASA LSDA datasets. Explore health metrics, mission types, crew roles, and predictive modeling for future space missions.',
  keywords: 'ISS, International Space Station, NASA, LSDA, crew health, space medicine, astronaut health, space mission analysis, health monitoring, space exploration',
  authors: [{ name: 'ISS Health Analytics Team' }],
  icons: {
    icon: '/images/iss_icon.png',
    shortcut: '/images/iss_icon.png',
    apple: '/images/iss_icon.png',
  },
  openGraph: {
    title: 'ISS Crew Health Analysis | NASA LSDA Data Insights',
    description: 'Comprehensive analysis of International Space Station crew health data using NASA LSDA datasets.',
    type: 'website',
    siteName: 'ISS Crew Health Analysis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISS Crew Health Analysis | NASA LSDA Data Insights',
    description: 'Comprehensive analysis of International Space Station crew health data using NASA LSDA datasets.',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9FAFB' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1426' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black min-h-screen text-white selection:bg-yellow-500/20`}
        suppressHydrationWarning={true}
      >
        <div className="relative min-h-screen">
          {/* Animated Space Background */}
          <SpaceBackgroundWrapper />
          
          {/* Global Navigation */}
          <GlobalNavbar />
          
          {/* Gamification System */}
          <GamificationSystem />
          
          {/* Main Content */}
          <div className="relative z-10 pt-12">
            {children}
          </div>
        </div>
        
        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
