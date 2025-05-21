import type React from "react";
import { SiteHeader } from "@/components/sections/site-header";
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trợ lý ảo",
  description: "Trợ lý ảo giao thông",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-background">
      <div className="h-full flex flex-col overflow-y-hidden">
        <SiteHeader />

        <main className="flex-1 bg-white">{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
