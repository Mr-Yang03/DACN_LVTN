import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsTable } from "@/components/admin/NewsTable";

export const metadata: Metadata = {
  title: "Quản lý tin tức | Traffic Monitor",
  description: "Quản lý và đăng tải tin tức giao thông",
};

export default function NewsAdminPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
            Quản lý tin tức
            </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và đăng tải tin tức giao thông
          </p>
        </div>
        <Button 
          asChild
          className="bg-black transition-all shadow-md"
        >
          <Link href="/admin/news/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <NewsTable />
      </div>
    </div>
  );
}
