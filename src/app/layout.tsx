import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Golos_Text } from "next/font/google";
import localFont from "next/font/local";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const golosText = Golos_Text({
  subsets: ["latin"],
  variable: "--font-golos-text",
});

const sageGrotesk = localFont({
    src: '../../public/fonts/Sage-Grotesk.woff2',
    variable: "--font-sage-grotesk",
  });

export const metadata: Metadata = {
  title: "Street Barbell",
  description: "Street Barbell is a barbell brand that makes high-quality barbell products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${golosText.variable} ${sageGrotesk.variable}`} style={{ margin: 0, padding: 0 }}>
        <HtmlLangSetter />
        {children}
      </body>
    </html>
  );
}
