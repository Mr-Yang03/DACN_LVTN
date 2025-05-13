
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/userboard";
import { updateUser } from "@/apis/userboardApi";

interface Props {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditUserForm: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    license_number: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        date_of_birth: user.date_of_birth || "",
        phone_number: user.phone_number || "",
        license_number: user.license_number || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    await updateUser(user._id, formData);
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Họ tên" />
          <Input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} placeholder="Ngày sinh (YYYY-MM-DD)" />
          <Input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Số điện thoại" />
          <Input name="license_number" value={formData.license_number} onChange={handleChange} placeholder="Số giấy phép" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={handleSubmit}>Cập nhật</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
