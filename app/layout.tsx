import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "قرد يتكلم بالعربية",
  description:
    "تجربة تفاعلية مع قرد لطيف يتكلم العربية ويشاركك حكايات مرحة وأصوات ممتعة."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
