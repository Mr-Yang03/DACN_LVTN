// ✅ page.tsx (đơn giản hóa sau khi UserTable tự quản lý refetch và modal)
"use client";

import { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import { User } from "@/types/userboard";

export default function UserboardPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
