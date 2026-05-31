import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tonti-net.com"),
  applicationName: "TONTI-NET",
  title: {
    default: "TONTI-NET | Gestion de tontines digitales au Mali",
    template: "%s | TONTI-NET",
  },
  description:
    "Digitalisez vos tontines au Mali avec TONTI-NET : gestion des groupes, cotisations, tours, membres, rappels et historique transparent depuis votre téléphone.",
  keywords: [
    "TONTI-NET",
    "tontine Mali",
    "tontine digitale",
    "gestion de tontines",
    "fintech Mali",
    "cotisations tontine",
    "Bamako",
    "Afrique de l'Ouest",
    "UEMOA",
  ],
  authors: [{ name: "TONTI-NET" }],
  creator: "TONTI-NET",
  publisher: "TONTI-NET",
  category: "finance",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/logo.jpg", type: "image/jpeg" }],
    shortcut: "/favicon.ico",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "fr_ML",
    url: "/",
    siteName: "TONTI-NET",
    title: "TONTI-NET | Vos tontines, enfin digitalisées",
    description:
      "Une fintech malienne pour gérer vos cotisations, vos tours et vos membres de tontine avec transparence.",
    images: [
      {
        url: "/logo.jpg",
        width: 512,
        height: 512,
        alt: "Logo TONTI-NET",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TONTI-NET | Gestion de tontines digitales au Mali",
    description:
      "Gérez vos tontines, cotisations, membres et rappels automatiquement avec TONTI-NET.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
