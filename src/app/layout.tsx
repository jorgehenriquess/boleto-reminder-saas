import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import { PWAProvider } from "@/components/pwa/pwa-provider";
import { AuthSessionProvider } from "@/components/auth/session-provider";
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
  title: "BoletoReminder - Reduza Inadimplência em 70% com WhatsApp Automático",
  description: "Plataforma de cobrança automática via WhatsApp para pequenas empresas. Lembretes inteligentes que aumentam pagamentos em 70% e economizam 20h/mês. Teste 7 dias grátis!",
  keywords: [
    "cobrança automática whatsapp",
    "lembrete boleto whatsapp", 
    "reduzir inadimplência",
    "sistema cobrança pequena empresa",
    "automation cobrança",
    "whatsapp business api",
    "software financeiro",
    "gestão boletos",
    "saas cobrança",
    "automation financeiro"
  ],
  authors: [{ name: "BoletoReminder" }],
  creator: "BoletoReminder",
  publisher: "BoletoReminder",
  category: "Business Software",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BoletoReminder',
    startupImage: [
      {
        url: '/icons/icon-192x192.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    title: "BoletoReminder - Reduza Inadimplência em 70% com WhatsApp",
    description: "Automatize sua cobrança com lembretes via WhatsApp. +500 empresas aumentaram pagamentos em 70%. Teste 7 dias grátis, sem cartão!",
    url: '/',
    siteName: 'BoletoReminder',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoletoReminder - Sistema de Cobrança Automática via WhatsApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@boletoreminder',
    creator: '@boletoreminder',
    title: "BoletoReminder - Reduza Inadimplência em 70%",
    description: "Lembretes automáticos via WhatsApp que funcionam. +500 empresas confiam. Teste grátis!",
    images: ['/twitter-image.png'],
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
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <PWAProvider>
                {children}
              </PWAProvider>
            </ErrorBoundary>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}