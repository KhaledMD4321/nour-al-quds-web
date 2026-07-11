import type { Metadata } from "next";
import { Alexandria, Kufam, IBM_Plex_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getCatalogByStage } from "@/lib/erp";
import { site } from "@/lib/site";

// Alexandria — النظام كله (عناوين + متن + واجهة)
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
});
// Kufam — اللوجو فقط (fallback حي)
const kufam = Kufam({
  subsets: ["arabic", "latin"],
  variable: "--font-kufam",
  display: "swap",
});
// IBM Plex Mono — الأكواد والأرقام
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
// Cairo — fallback (توافق مع الـ ERP)
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "نور القدس",
    "أدوات صحية",
    "سباكة",
    "أنظمة مياه",
    "مواسير",
    "خلاطات",
    "بني سويف",
    "الواسطى",
    "شحن لكل مصر",
    "نصّار",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: site.name,
    title: site.fullName,
    description: site.description,
  },
  icons: { icon: "/favicon_256.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await getCatalogByStage();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${kufam.variable} ${plexMono.variable} ${cairo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Header catalog={catalog} />
        {children}
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
