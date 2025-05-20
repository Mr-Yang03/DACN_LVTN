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
import { Loader2 } from "lucide-react";

interface Props {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditUserForm: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !user.account_id) return;

    try {
      setIsLoading(true);
      if (password.trim() !== "") {
        await resetPassword(user.account_id, password.trim());
      }
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={(open) => !isLoading && onClose()}>
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
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
