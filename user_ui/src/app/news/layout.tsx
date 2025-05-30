import type React from "react";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức giao thông",
  description: "Xem tin tức giao thông thành phố",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex flex-col">
        <SiteHeader />

        <main className="flex-1 bg-[#F6F8FC]">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
