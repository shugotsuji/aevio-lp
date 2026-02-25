import { Sora, Noto_Sans_JP } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata = {
  title: "Aevio — AI検索を、エージェントが最適化する。",
  description:
    "AevioのAIエージェントが、ChatGPTからLINE AIまで日本のAI検索を一括で監視・分析・最適化。日本初のAEOプラットフォーム。",
  openGraph: {
    title: "Aevio — AI検索を、エージェントが最適化する。",
    description:
      "ChatGPTからLINE AIまで、日本のAI検索をエージェントが自動で最適化するAEOプラットフォーム。",
    url: "https://aevio.ai",
    siteName: "Aevio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aevio — AI検索を、エージェントが最適化する。",
    description:
      "ChatGPTからLINE AIまで、日本のAI検索をエージェントが自動で最適化。",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${sora.variable} ${notoSansJP.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
