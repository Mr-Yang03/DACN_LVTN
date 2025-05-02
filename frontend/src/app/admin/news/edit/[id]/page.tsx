import type { Metadata } from 'next';
import { ModifyNewsEditor } from '@/components/admin/ModifyNewsEditor';

// Generate dynamic metadata based on the news ID
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = await params.id;
  
  return {
    title: `Chỉnh sửa bài viết #${id} | Traffic Monitor`,
    description: `Chỉnh sửa và cập nhật bài viết tin tức giao thông #${id}`,
  };
}

export default async function ModifyNewsPage({ params }: { params: { id: string } }) {
  const id = await params.id;
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h1>
        <p className="text-gray-500 mt-1 italic">
          Đang chỉnh sửa bài viết có mã <code className="bg-gray-100 px-1 py-0.5 rounded">{id}</code>
        </p>
      </div>

      <ModifyNewsEditor newsId={id} />
    </div>
  );
}