import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from 'next/font/google'
import "./globals.css";

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const rajdhani = Rajdhani({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Компьютерный клуб Rave By Cayman",
  description: "Премиальный компьютерный клуб с топовым железом и лучшими консолями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
