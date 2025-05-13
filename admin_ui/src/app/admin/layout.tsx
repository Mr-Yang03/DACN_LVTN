// File: /app/admin/layout.tsx
'use client';

import type { ReactNode } from 'react';
// import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 lg:flex-row">
      {/* Sidebar - responsive toggle */}
      {/* <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r shadow z-20">
        <Sidebar />
      </aside> */}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        <AdminHeader />
        <main className="h-screen flex-1 p-4 overflow-y-auto">
          <div className="h-full max-w-screen-2xl mx-auto min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
