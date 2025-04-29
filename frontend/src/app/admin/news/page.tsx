import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsTable } from '@/components/admin/NewsTable';

export const metadata: Metadata = {
  title: 'Quản lý tin tức | Traffic Monitor',
  description: 'Quản lý và đăng tải tin tức giao thông',
};

export default function NewsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tin tức</h1>
          <p className="text-gray-500 mt-1 italic">Quản lý và đăng tải tin tức giao thông</p>
        </div>
        <Button asChild >
          <Link href="/admin/news/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      <NewsTable />
    </div>
  );
}