import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WaveGradient } from "@/components/ui/wave-gradient";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADGIPS Delhi — Dr. Akhilesh Das Gupta Institute of Professional Studies",
  description:
    "Official campus & student experience platform for Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), GGSIPU Affiliated. Explore institutional events, academic departments, student activities, and campus opportunities.",
  keywords: [
    "ADGIPS",
    "ADGITM",
    "Northern India Engineering College",
    "GGSIPU",
    "Campus Events",
    "Engineering Delhi",
    "Law Delhi",
    "BBA",
    "BBD Group",
  ],
  authors: [{ name: "ADGIPS Student Experience Platform" }],
  icons: {
    icon: "/images/adgips-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#040915] text-slate-100 selection:bg-blue-600 selection:text-white relative">
        <ToastProvider>
          <WaveGradient />
          <CustomCursor />
          <Navbar />
          <div className="flex-1 flex flex-col relative z-0">{children}</div>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
