import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/components/ToasterContext";
import Provider from "../../components/Provider";
import { useSession } from 'next-auth/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth anhanh chat",
  description: "Build a next chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession(); // Retrieve the session object

  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        <Provider session={session}>
          <ToasterContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}
