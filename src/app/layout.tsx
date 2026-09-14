import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { brand } from "@/data/copy";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
  applicationName: brand.name,
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: brand.name, statusBarStyle: "black-translucent" },
  openGraph: {
    title: brand.name,
    description: brand.tagline,
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6fa5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
