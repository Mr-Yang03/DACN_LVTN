"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import withAuth from "@/HOC/with-auth";

const AdminLayout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="max-w-screen flex flex-col bg-gray-100 h-full lg:flex-row lg:overflow-hidden">
      <div className="">
        <Sidebar/>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="h-full overflow-y-auto">
          <div className="h-full mx-auto bg-gradient-to-b from-slate-50 to-slate-100">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(AdminLayout);
