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
}

export default function UserProfilePage() {
  const { isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>({ fullname: "", email: "" });
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
    // Fake saving logic, should be API call
    setTimeout(() => {
      localStorage.setItem("user_data", JSON.stringify(userData));
      toast.success("Thông tin đã được cập nhật");
      setLoading(false);
    }, 800);
  };

  if (!isAuthenticated) return <p className="p-4">Bạn cần đăng nhập để xem thông tin cá nhân.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <Input value={userData.fullname} onChange={e => handleChange("fullname", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={userData.email} onChange={e => handleChange("email", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <Input type="tel" value={userData.phone || ""} onChange={e => handleChange("phone", e.target.value)} />
          </div>

          <Button onClick={handleSave} disabled={loading} className="mt-4">
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
