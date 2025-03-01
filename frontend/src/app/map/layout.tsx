"use client";

import type React from "react";
// import { SiteHeader } from "@/components/sections/site-header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="h-screen flex flex-col">
        {/* <SiteHeader /> */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
