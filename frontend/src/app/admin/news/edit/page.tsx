import type { Metadata } from 'next';
import { ModifyNewsEditor } from '@/components/admin/ModifyNewsEditor';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết | Traffic Monitor',
  description: 'Chỉnh sửa và cập nhật bài viết tin tức giao thông',
};

export default function ModifyNewsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h1>
        <p className="text-gray-500 mt-1 italic">Chỉnh sửa và cập nhật bài viết tin tức giao thông</p>
      </div>

      <ModifyNewsEditor />
    </div>
  );
}