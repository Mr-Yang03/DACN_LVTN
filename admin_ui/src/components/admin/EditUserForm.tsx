
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/userboard";
import { resetPassword } from "@/apis/userboardApi";

interface Props {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditUserForm: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !user.account_id) return;

    if (password.trim() !== "") {
      await resetPassword(user.account_id, password.trim());
    }

    onUpdated();
    onClose();
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Cập nhật mật khẩu</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
