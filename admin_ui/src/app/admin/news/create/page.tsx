import type { Metadata } from 'next';
import { NewsEditor } from '@/components/admin/NewsEditor';

export const metadata: Metadata = {
  title: 'Tạo bài viết mới | Traffic Monitor',
  description: 'Tạo và đăng bài viết tin tức giao thông mới',
};

export default function CreateNewsPage() {
  return (
    <div className="space-y-6 px-6 pt-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tạo bài viết mới</h1>
        <p className="text-gray-500 mt-1 italic">Soạn thảo và đăng tải bài viết tin tức giao thông</p>
      </div>

      <NewsEditor />
    </div>
  );
}