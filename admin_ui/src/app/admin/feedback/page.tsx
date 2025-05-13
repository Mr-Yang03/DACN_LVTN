"use client";

import FeedbackTable from "@/components/admin/FeedbackTable";

export default function NewsAdminPage() {
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quản lý phản ánh</h1>
                        <p className="text-gray-500 mt-1 italic">Quản lý phản ánh của người dùng về giao thông thành phố</p>
                    </div>
                </div>
            </div>

            <FeedbackTable />
        </> 
    );
}