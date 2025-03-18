/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToggle } from "@/hooks/useToggle"
import { PasswordInput } from "@/components/ui/PasswordInput"

export default function RegisterForm({ onSwitchTab }: { onSwitchTab: () => void }) {
  const [showPassword, toggleShowPassword] = useToggle()
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle()

  // Thêm state quản lý form
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  // Xử lý khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu không khớp!")
      return
    }

    if (!form.acceptTerms) {
      alert("Bạn cần đồng ý điều khoản!")
      return
    }

    // Gửi request đến API Gateway
    const response = await fetch("http://localhost:9000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: form.fullname,
        email: form.email,
        password: form.password
      })
    })

    if (!response.ok) {
      alert("Đăng ký thất bại!")
    } else {
      alert("Đăng ký thành công!")
      onSwitchTab()
    }
  }

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl text-center font-bold text-slate-800">Đăng Ký</h2>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-slate-700 font-medium">Họ và tên</Label>
          <Input id="fullname" value={form.fullname} onChange={handleChange} placeholder="Nguyễn Văn A" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">Mật khẩu</Label>
          <PasswordInput id="password" value={form.password} onChange={handleChange} show={showPassword} toggleShow={toggleShowPassword} placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Xác nhận mật khẩu</Label>
          <PasswordInput id="confirmPassword" value={form.confirmPassword} onChange={handleChange} show={showConfirmPassword} toggleShow={toggleShowConfirmPassword} placeholder="••••••••" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="acceptTerms" checked={form.acceptTerms} onCheckedChange={val => handleChange({ target: { id: 'acceptTerms', type: 'checkbox', checked: val } } as any)} />
          <label htmlFor="acceptTerms" className="text-sm font-medium text-slate-700">
            Tôi đồng ý với{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">Điều khoản sử dụng</Link>
          </label>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl">Đăng Ký</Button>
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
