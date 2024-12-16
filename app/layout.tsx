import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { BookType } from "@/lib/types";
import Home from "./page";

export const metadata: Metadata = {
  title: "Book Tracker",
  description: "Some software to help you keep track of the books you want to (or have) read."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Home />
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
