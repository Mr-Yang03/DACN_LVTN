// ✅ page.tsx (đơn giản hóa sau khi UserTable tự quản lý refetch và modal)
import UserTable from "@/components/admin/UserTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Traffic Monitor",
  description: "Quản lý danh sách người dùng hệ thống",
};

export default function UserboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý về thông tin của người dùng hệ thống
          </p>
        </div>
      </div>
      <UserTable />
    </div>
  );
}
