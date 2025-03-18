"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToggle } from "@/hooks/useToggle"
import {PasswordInput} from "@/components/ui/PasswordInput"

export default function RegisterForm({ onSwitchTab }: { onSwitchTab: () => void }) {
  const [showPassword, toggleShowPassword] = useToggle()
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle()

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl text-center font-bold text-slate-800">Đăng Ký</h2>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-slate-700 font-medium">Họ và tên</Label>
          <Input id="fullname" placeholder="Nguyễn Văn A" className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-slate-700 font-medium">Email</Label>
          <Input id="register-email" type="email" placeholder="email@example.com" className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-slate-700 font-medium">Mật khẩu</Label>
          <PasswordInput id="register-password" show={showPassword} toggleShow={toggleShowPassword} placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Xác nhận mật khẩu</Label>
          <PasswordInput id="confirm-password" show={showConfirmPassword} toggleShow={toggleShowConfirmPassword} placeholder="••••••••" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label htmlFor="terms" className="text-sm font-medium text-slate-700">
            Tôi đồng ý với{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">Điều khoản sử dụng</Link>
          </label>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl">Đăng Ký</Button>
      </CardFooter>
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-slate-600 mt-4">
          Đã có tài khoản?{' '}
          <button className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline" onClick={onSwitchTab}>Đăng nhập</button>
        </p>
      </div>
    </Card>
  )
}
