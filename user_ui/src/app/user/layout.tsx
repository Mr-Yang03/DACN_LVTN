import type React from "react";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin người dùng",
  description: "Quản lý và cập nhật thông tin cá nhân của bạn",
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

        <main className="flex-1 bg-green-50">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
