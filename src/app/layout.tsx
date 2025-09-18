import type { Metadata } from "next";

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
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
