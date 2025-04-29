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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToggle } from "@/hooks/useToggle";
import { useAuth } from "@/context/auth-context";
import { loginSchema } from "@/validations/userSchema";
import { login } from "@/apis/userApi";
import { toast } from "react-toastify";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({
  onSwitchTab,
}: {
  onSwitchTab: () => void;
}) {
  const { setToken } = useAuth();
  const [showPassword, toggleShowPassword] = useToggle();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await login(values.email, values.password);
      setToken(data.access_token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      if (values.remember) {
        localStorage.setItem("token", data.access_token);
      } else {
        sessionStorage.setItem("token", data.access_token);
      }

      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác"
      );
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-4">
            <h2 className="text-2xl text-center font-bold text-slate-800">
              Đăng Nhập
            </h2>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel className="text-slate-700 font-medium">
                      Mật khẩu
                    </FormLabel>
                    <Link
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
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

            {/* Remember me */}
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                    Ghi nhớ đăng nhập
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </CardFooter>
        </form>
      </Form>
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-slate-600 mt-4">
          Chưa có tài khoản?{" "}
          <button
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            onClick={onSwitchTab}
            type="button"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </Card>
  );
}
