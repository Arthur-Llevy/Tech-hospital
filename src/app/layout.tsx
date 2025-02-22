import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const relaway = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Hospital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${relaway.variable}  antialiased`}
      >
        <Header />
        {children}
        <div className="mt-16">
          <Footer />
        </div>
      </body>
    </html>
  );
}
