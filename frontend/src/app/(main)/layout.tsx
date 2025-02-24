"use client";

import type React from "react";

import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex flex-col">
        <SiteHeader />

        <main className="flex-1 p-4">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
