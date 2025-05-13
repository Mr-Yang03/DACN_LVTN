
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

interface UserData {
  fullname: string;
  email: string;
  phone?: string;
  cccd?: string;
  birthday?: string;
}

const defaultAdminData: UserData = {
  fullname: "Nguyễn Văn An",
  email: "an.nguyen@admin.gov.vn",
  phone: "0912345678",
  cccd: "012345678901",
  birthday: "1980-05-15",
};

export default function UserProfilePage() {
  const { isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>(defaultAdminData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user_data");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user_data", JSON.stringify(userData));
      toast.success("Thông tin đã được cập nhật");
      setLoading(false);
    }, 800);
  };

  if (!isAuthenticated)
    return <p className="p-4 text-center text-sm text-gray-500">Bạn cần đăng nhập để xem thông tin cá nhân.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-gray-800">Thông tin tài khoản quản trị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
            <Input
              value={userData.fullname}
              onChange={e => handleChange("fullname", e.target.value)}
              placeholder="Họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={userData.email}
              onChange={e => handleChange("email", e.target.value)}
              placeholder="Địa chỉ email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
            <Input
              type="tel"
              value={userData.phone || ""}
              onChange={e => handleChange("phone", e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Số căn cước công dân</label>
            <Input
              type="text"
              value={userData.cccd || ""}
              onChange={e => handleChange("cccd", e.target.value)}
              placeholder="012345678901"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
            <Input
              type="date"
              value={userData.birthday || ""}
              onChange={e => handleChange("birthday", e.target.value)}
            />
          </div>

          <div className="pt-4 text-center">
            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}