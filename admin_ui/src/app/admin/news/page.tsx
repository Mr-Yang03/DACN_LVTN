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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
              Quản lý tin tức
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Quản lý và đăng tải tin tức giao thông
            </p>
        </div>
        <Button 
          asChild
          className="bg-black hover:bg-black/90 transition-all shadow-md w-full md:w-auto mt-2 md:mt-0"
        >
          <Link href="/admin/news/create" className="flex items-center justify-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-3 sm:p-6 overflow-x-auto">
        <div className="w-full">
          <NewsTable />
        </div>
      </div>
    </div>
  );
}
