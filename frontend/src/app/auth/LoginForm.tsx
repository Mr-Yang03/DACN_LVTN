"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useToggle } from "@/hooks/useToggle";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function LoginForm({
  onSwitchTab,
}: {
  onSwitchTab: () => void;
}) {
  const [showPassword, toggleShowPassword] = useToggle();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false); // Thêm state remember

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:9000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    if (!response.ok) {
      alert("Đăng nhập thất bại!");
    } else {
      const data = await response.json();
      alert("Đăng nhập thành công!");
      console.log("Token:", data.access_token);

      // Nếu người dùng tích "Ghi nhớ", lưu token vào localStorage
      if (remember) {
        localStorage.setItem("access_token", data.access_token);
      } else {
        sessionStorage.setItem("access_token", data.access_token);
      }

      // Chuyển hướng về trang chủ
      window.location.href = "/";
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl text-center font-bold text-slate-800">
          Đăng Nhập
        </h2>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Mật khẩu
            </Label>
            <Link
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={form.password}
            onChange={handleChange}
            show={showPassword}
            toggleShow={toggleShowPassword}
            placeholder="••••••••"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={() => setRemember(!remember)} />
          <label
            htmlFor="remember"
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={handleSubmit}
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Đăng Nhập
        </Button>
      </CardFooter>
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-slate-600 mt-4">
          Chưa có tài khoản?{" "}
          <button
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            onClick={onSwitchTab}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </Card>
  );
}
