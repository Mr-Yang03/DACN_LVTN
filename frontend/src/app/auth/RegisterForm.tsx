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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm({
  onSwitchTab,
}: {
  onSwitchTab: () => void;
}) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const [showPassword, toggleShowPassword] = useToggle();
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values.fullname, values.email, values.password);

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
            {/* Họ và tên */}
            <FormField
              control={form.control}
              name="fullname"
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
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
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
            >
              Đăng Ký
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
