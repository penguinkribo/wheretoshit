import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { UserProvider } from "./components/UserProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhereToShit - Singapore Toilet Finder 💩",
  description:
    "Find the nearest clean toilet in Singapore. Crowdsourced reviews, bidet info, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Header />
          <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
