import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maksim Travels | Book Your Journey with Expert Guidance",
  description: "Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
          suppressHydrationWarning
        />
      </head>
      <body className="bg-slate-50 text-slate-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
