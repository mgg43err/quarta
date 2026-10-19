import type { Metadata } from "next";
import { Manrope, Prata } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const prata = Prata({
  variable: "--font-prata",
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Кварта — свежая обжарка, Минск",
  description:
    "Маленькая обжарка в Минске. Жарим маленькими партиями по 5 кг, развозим по пятницам. Зерно у вас на 1–3 день после обжарки.",
  openGraph: {
    title: "Кварта — свежая обжарка, Минск",
    description:
      "Жарим по четвергам, развозим по пятницам. Зерно приезжает к вам на 1–3 день после обжарки.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${prata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
