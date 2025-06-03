import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bản đồ giao thông",
  description: "Xem bản đồ, tình trạng và camera giao thông",
};

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
