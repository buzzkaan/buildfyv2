import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Buildfy - AI Web Builder",
  description:
    "Create apps and websites by chatting with AI. Build something extraordinary with Buildfy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C96342",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" className="bg-background" suppressHydrationWarning>
          <body
            className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} font-sans antialiased overflow-x-hidden`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <div className="noise-overlay" aria-hidden="true" />
              <Toaster />
              <SmoothScroll>{children}</SmoothScroll>
            </ThemeProvider>
            <Analytics />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
