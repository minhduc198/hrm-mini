import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const fontSans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
