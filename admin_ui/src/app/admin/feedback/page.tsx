"use client";

import FeedbackTable from "@/components/admin/FeedbackTable";

export default function NewsAdminPage() {
  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Quản lý phản ánh
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý phản ánh của người dùng về giao thông thành phố
            </p>
          </div>
        </div>
      </div>
      <div className="px-6">
        <FeedbackTable />
      </div>
    </>
  );
}
