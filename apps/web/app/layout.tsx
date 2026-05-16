import type { Metadata } from "next";
import './globals.css'
import { ReduxProvider } from "@/reduxConfig/reduxProvider";
import GoogleAnalytics from "@/@comp/GoogleAnalytics";
import MicrosoftClarity from "@/@comp/MicrosoftClarity";

export const metadata: Metadata = {
  title: "Clarix AI – Free AI Prompt Generator for ChatGPT, Midjourney & More",
  description:
    "Clarix AI is a free AI prompt generator that helps you create powerful, effective prompts for ChatGPT, Midjourney, Stable Diffusion, and other AI models.",
  keywords: [
    "AI prompt generator",
    "Clarix AI",
    "Clarix",
    "prompt generator",
    "ChatGPT prompts",
    "Midjourney prompts",
    "free prompt generator",
  ],
  authors: [{ name: "Clarix AI" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://www.clarixai.in",
  },
  openGraph: {
    type: "website",
    url: "https://www.clarixai.in",
    title: "Clarix AI – Free AI Prompt Generator",
    description:
      "Generate powerful AI prompts for ChatGPT, Midjourney, and more with Clarix AI. Free, fast, and effective.",
    siteName: "Clarix AI",
    locale: "en_IN",
    images: [
      {
        url: "https://www.clarixai.in/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clarix AI Prompt Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarix AI – Free AI Prompt Generator",
    description:
      "Generate powerful AI prompts for ChatGPT, Midjourney, and more with Clarix AI.",
    images: ["https://www.clarixai.in/og-image.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Passero+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Clarix AI",
              url: "https://www.clarixai.in",
              description:
                "Free AI prompt generator for ChatGPT, Midjourney, Stable Diffusion and other AI models.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <MicrosoftClarity />

        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
