import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ATAC",
  description: "ATAC - Taktiksel Silah Sistemleri ve 3D İnceleme Portalı.",
  authors: [{ name: "ATAC" }],
  icons: {
    icon: "/ATAC LOGO.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="bg-black text-white min-h-full antialiased font-outfit">
        {children}
      </body>
    </html>
  );
}
