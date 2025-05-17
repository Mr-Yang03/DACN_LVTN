"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToggle } from "@/hooks/useToggle";
import Link from "next/link";
import { registerSchema } from "@/validations/userSchema";
import { register } from "@/apis/userApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { checkUsername } from "@/apis/userApi";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm({
  onSwitchTab,
}: {
  onSwitchTab: () => void;
}) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      full_name: "",
      phone_number: "",
      date_of_birth: "",
      license_number: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle();
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle();

  // // Hàm kiểm tra username
  // const handleUsernameBlur = async (value: string) => {
  //   if (!value || value.trim() === "") return;
    
  //   setIsCheckingUsername(true);
  //   try {
  //     const exists = await checkUsername(value);
  //     setUsernameExists(exists.exists);
  //     if (usernameExists) {
  //       form.setError("username", {
  //         type: "manual",
  //         message: "Tên đăng nhập đã tồn tại"
  //       });
  //     } else {
  //       form.clearErrors("username");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi kiểm tra username:", error);
  //   }
  // };

  // // Thêm hàm xử lý khi focus vào input username
  // const handleUsernameFocus = () => {
  //   // Xóa thông báo lỗi khi người dùng bắt đầu chỉnh sửa
  //   form.clearErrors("username");
  // };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Kiểm tra username một lần nữa trước khi đăng ký
      const exists = await checkUsername(values.username);
      if (exists.exists) {
        form.setError("username", {
          type: "manual",
          message: "Tên đăng nhập đã tồn tại"
        });
        return;
      }

      await register(
        values.username,
        values.password,
        values.full_name,
        values.date_of_birth,
        values.phone_number,
        values.license_number || "" // Sử dụng chuỗi rỗng nếu license_number không được cung cấp
      );

      toast.success("Đăng ký thành công!");
      onSwitchTab();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl text-center font-bold text-slate-800">
          Đăng Ký
        </h2>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tên đăng nhập */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <div>
                      <Input 
                        placeholder="username123" 
                        {...field} 
                        // onFocus={handleUsernameFocus}
                        // onBlur={(e) => {
                        //   field.onBlur();
                        //   handleUsernameBlur(e.target.value);
                        // }}
                      />
                      {/* {usernameExists && isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      {!usernameExists && isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            <p className="text-sm font-medium text-green-600">Username hợp lệ</p>
                          </svg>
                        </div>
                      )} */}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {/* {!usernameExists && !form.formState.errors.username && (
                    <p className="text-sm font-medium text-green-600">Username hợp lệ</p>
                  )} */}
                </FormItem>
              )}
            />
            
            {/* Họ và tên */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Số điện thoại */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Ngày sinh */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Số giấy phép */}
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số giấy phép lái xe (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Mật khẩu */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      show={showPassword}
                      toggleShow={toggleShowPassword}
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Xác nhận mật khẩu */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      show={showConfirmPassword}
                      toggleShow={toggleShowConfirmPassword}
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Điều khoản */}
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(!!val)}
                    />
                  </FormControl>
                  <div className="text-sm font-medium text-slate-700">
                    Tôi đồng ý với{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Điều khoản sử dụng
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                "Đăng Ký"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="px-6 pb-6 text-center">
        <p className="w-full text-sm text-slate-600 mt-4">
          Đã có tài khoản?{" "}
          <button
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            onClick={onSwitchTab}
          >
            Đăng nhập
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
