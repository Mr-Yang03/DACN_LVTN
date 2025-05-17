"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LogOut, Calendar, IdCard, Phone, User } from "lucide-react"
import { useAuth } from "@/context/auth-context";
import { updateUserInfo } from "@/apis/userApi"
import { toast } from "react-toastify";

interface UserInfo {
  username: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  license_number: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, setToken } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  const userData = () => {
    const userData = JSON.parse(
      localStorage.getItem("user_data") || "{}"
    );
    return userData
  };
  console.log(userData())
  const [user, setUser] = useState<UserInfo>({
    username: userData().username,
    full_name: userData().full_name,
    date_of_birth: userData().date_of_birth,
    phone_number: userData().phone_number,
    license_number: userData().license_number,
  })

  const handleSignOut = () => {
    // Handle sign out logic here
    setToken("");
    // Redirect to login page after sign out
    router.push("/auth")
  }

  const onSubmit = async () => {
    try {
      // Call your API to update user information
      const userInfo = user
      const response = await updateUserInfo(userInfo.username, userInfo.full_name, userInfo.date_of_birth, userInfo.phone_number, userInfo.license_number);
      setUser(response.data);
      toast.success("Cập nhật thông tin thành công!");
      window.location.reload();
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!");
      console.error("Error updating user information:", error);
    }
  }

  const formatDateForInput = (dateString: Date) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const timezoneOffset = d.getTimezoneOffset() * 60000; // in milliseconds
    const localISODate = new Date(d.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
    return localISODate; // yyyy-mm-dd
  };

  return (
    <>
      {isAuthenticated && (
        <div className="min-h-screen bg-background">
          {/* Main content */}
          <main className="container mx-auto py-8 px-4 md:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Profile header with avatar */}
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/image/default_avatar.png" alt={userData().full_name} />
                      <AvatarFallback>
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-white">
                        Thay đổi
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-bold">{userData().full_name}</h2>
                    <p className="text-muted-foreground">Thành viên từ 01/01/2023</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleSignOut} className="mt-4 md:mt-0">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>

              <Separator />

              {/* Personal information form */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Thông tin cá nhân</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      Họ và tên
                    </Label>
                    <div className="flex">
                      <User className="mr-2 h-4 w-4 opacity-70 my-auto" />
                      <Input
                        id="name"
                        defaultValue={userData().full_name}
                        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base">
                      Ngày sinh
                    </Label>
                    <div className="flex">
                      <Calendar className="mr-2 h-4 w-4 opacity-70 my-auto" />
                      <Input
                        id="birthdate"
                        type="date"
                        defaultValue={formatDateForInput(userData().date_of_birth)}
                        onChange={(e) => setUser({ ...user, date_of_birth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">
                      Số điện thoại
                    </Label>
                    <div className="flex">
                      <Phone className="mr-2 h-4 w-4 opacity-70 my-auto" />
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={userData().phone_number}
                        onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base">
                      Số GPLX
                    </Label>
                    <div className="flex">
                      <IdCard className="mr-2 h-4 w-4 opacity-70 my-auto" />
                      <Input
                        id="license"
                        defaultValue={userData().license_number}
                        onChange={(e) => setUser({ ...user, license_number: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button onClick={onSubmit}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  )
}
