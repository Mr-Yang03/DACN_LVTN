"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LogOut, Calendar, IdCard, Phone, User } from "lucide-react"
import { useAuth } from "@/context/auth-context";
import { updateUserInfo, uploadAvatar, updateAvatar } from "@/apis/userApi"
import { toast } from "@/components/ui/use-toast";
import { useToast } from '@/hooks/use-toast';
import FeedbackTable from "@/components/ui/FeedbackTable";

interface UserInfo {
  account_id: string;
  username: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  license_number: string;
  avatar: string;
}

// Function to extract image URLs from HTML content
const extractImageUrls = (htmlContent: string): string[] => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    // Skip URLs that are already from Google Cloud Storage
    if (!match[1].includes('googleusercontent.com')) {
      urls.push(match[1]);
    }
  }
  
  return urls;
};

// Function to convert a URL to a File object
const urlToFile = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || `image-${Date.now()}.${blob.type.split('/')[1]}`;
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    return null;
  }
};

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, setToken } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast();

  const userData = () => {
    const userData = JSON.parse(
      localStorage.getItem("user_data") || "{}"
    );
    return userData
  };
  console.log(userData())
  const [user, setUser] = useState<UserInfo>({
    account_id: userData()._id,
    username: userData().username,
    full_name: userData().full_name,
    date_of_birth: userData().date_of_birth,
    phone_number: userData().phone_number,
    license_number: userData().license_number,
    avatar: userData().avatar
  })

  const handleSignOut = () => {
    // Handle sign out logic here
    setToken("");
    // Redirect to login page after sign out
    router.push("/auth")
  }

  const onSubmit = async () => {
    console.log(user)
    try {
      // Call your API to update user information
      setIsSubmitting(true)
      const userInfo = user
      if (!user.full_name || !user.date_of_birth || !user.phone_number || !user.license_number) {
        toast?.({
          title: "Có lỗi xảy ra",
          description: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive"
        });
        return
      }
      const response = await updateUserInfo(userInfo.account_id, userInfo.full_name, userInfo.date_of_birth, userInfo.phone_number, userInfo.license_number);
      if (response && response.data) {
        setIsSuccess(true);
        setUser(response.data);
        localStorage.setItem("user_data", JSON.stringify(response.data));
        toast?.({
          title: "Cập nhật thông tin thành công",
          variant: "default"
        });
        // router.push("/user/" + userInfo.username);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast?.({
        title: "Có lỗi xảy ra",
        description: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false)
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Process featured image if present
      let imageUrl = "";
      if (e.target.files && e.target.files.length > 0) {
        if (e.target.files[0] instanceof File) {
          // Trường hợp 1: featuredImage là File object
          const imageData = await uploadAvatar(e.target.files[0]);
          imageUrl = imageData.public_url;
        } else if (typeof e.target.files[0] === 'string') {
          // Trường hợp 2: featuredImage là data URL (Base64)
          if (e.target.value.startsWith('data:image')) {
            // Chuyển đổi Base64 thành File
            try {
              // Tách phần header và data của Base64
              const arr = e.target.value.split(',');
              const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              
              // Tạo File từ dữ liệu Base64
              const file = new File([u8arr], `featured-image-${Date.now()}.${mime.split('/')[1] || 'jpg'}`, { type: mime });
              
              // Upload File lên Google Cloud
              const imageData = await uploadAvatar(file);
              imageUrl = imageData.public_url;
            } catch (error) {
              console.error("Lỗi khi chuyển đổi Base64 sang File:", error);
              // Nếu không thể chuyển đổi, vẫn sử dụng URL Base64 (không được khuyến nghị cho production)
              imageUrl = e.target.value;
            }
          } else if (e.target.value.startsWith('https://storage.googleapis.com')) {
            // Trường hợp 3: featuredImage đã là Google Cloud URL
            imageUrl = e.target.value;
          }
        }
      }

      // Process content images
      let processedContent = e.target.value;
      const imageUrls = extractImageUrls(e.target.value);
      
      if (imageUrls.length > 0) {
        // Create a map to track original URLs and their cloud replacements
        const urlMap: Record<string, string> = {};
        
        // Upload each image to Google Cloud
        for (const url of imageUrls) {
          const file = await urlToFile(url);
          if (file) {
            const uploadResult = await uploadAvatar(file);
            urlMap[url] = uploadResult.public_url;
          }
        }
        
        // Replace all image URLs in the content
        Object.entries(urlMap).forEach(([originalUrl, cloudUrl]) => {
          processedContent = processedContent.replace(
            new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
            cloudUrl
          );
        });
      }
      
      const response = await updateAvatar(userData()._id, imageUrl);
      if (response && response.data) {
        setUser({ ...user, avatar: imageUrl });
        localStorage.setItem("user_data", JSON.stringify({ ...userData(), avatar: imageUrl }));
        toast?.({
          title: "Cập nhật ảnh đại diện thành công",
          variant: "default"
        });
        router.push("/user/" + user.account_id);
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      toast?.({
        title: "Có lỗi xảy ra",
        description: "Không thể tải ảnh lên. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  }

  return (
    <>
      {isAuthenticated && (
        // Profile
        <div className="min-h-screen bg-background">
          {/* Main content */}
          <main className="container mx-auto py-8 px-4 md:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Profile header with avatar */}
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={userData().avatar != "" ? userData().avatar : "/image/default_avatar.png"} alt={userData().full_name} />
                      <AvatarFallback>
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white"
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                      >
                        {isUploading ? "Đang tải..." : "Thay đổi"}
                      </Button> */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
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
                        type="text"
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
                <Button type="submit" onClick={onSubmit} disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white">
                  {isSubmitting ? (
                    <span className="loader">Đang cập nhật</span>
                  ) : (
                    <span className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </span>
                  )}
                </Button>
              </div>

              <Separator />

              {/* List feedback of this user */}
              <h3 className="text-xl font-semibold mb-6">Danh sách phản ánh đã gửi</h3>
              <FeedbackTable username={userData().username}/>
            </div>
          </main>
        </div>
      )}
    </>
  )
}
