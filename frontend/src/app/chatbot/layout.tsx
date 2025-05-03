// File: /app/admin/layout.tsx
'use client';

import type { ReactNode } from 'react';
// import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="fixed flex flex-col flex-1 h-screen w-screen">
        <AdminHeader />
        <main className="flex-1">
          <div className="w-full max-w-screen-2xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
