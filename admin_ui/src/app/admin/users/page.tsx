// ✅ page.tsx (đơn giản hóa sau khi UserTable tự quản lý refetch và modal)
"use client";

import { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import { User } from "@/types/userboard";

export default function UserboardPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
      <UserTable onEditUser={setSelectedUser} />
    </div>
  );
}
