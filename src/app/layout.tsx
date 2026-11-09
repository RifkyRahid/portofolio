import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rifky | Portofolio Pengembang Web",
  description: "Portofolio pribadi dan arsip proyek pengembang web.",
};

// Default theme is Dark Mode ("dark"), unless user explicitly chose "light"
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem("portfolio_theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let lang = "id";
  try {
    lang = await getLocale();
  } catch {
    lang = "id";
  }

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`dark ${spaceGrotesk.variable} ${plusJakarta.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-bg text-text-primary min-h-screen selection:bg-accent selection:text-bg transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
