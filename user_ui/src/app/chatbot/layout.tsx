"use client";

import type React from "react";

import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { Toaster } from "@/components/ui/toaster"

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
