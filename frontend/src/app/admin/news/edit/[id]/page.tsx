import type { Metadata } from 'next';
import { ModifyNewsEditor } from '@/components/admin/ModifyNewsEditor';

// Interface for Next.js App Router page parameters
interface NewsEditPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate dynamic metadata based on the news ID
export async function generateMetadata({ params }: NewsEditPageProps): Promise<Metadata> {
  const resolvedParams = await params; // Await params to resolve the Promise
  const id = resolvedParams?.id || 'unknown'; // Fallback for missing id
  
  return {
    title: `Chỉnh sửa bài viết #${id} | Traffic Monitor`,
    description: `Chỉnh sửa và cập nhật bài viết tin tức giao thông #${id}`,
  };
}

export default async function ModifyNewsPage({ params }: NewsEditPageProps) {
  const resolvedParams = await params; // Await params to resolve the Promise
  const id = resolvedParams?.id || 'unknown'; // Fallback for missing id
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h1>
        <p className="mt-1 italic text-gray-500">
          Đang chỉnh sửa bài viết có mã{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5">{id}</code>
        </p>
      </div>

      <ModifyNewsEditor newsId={id} />
    </div>
  );
}