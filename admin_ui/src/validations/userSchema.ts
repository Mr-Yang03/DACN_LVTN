import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
    full_name: z.string().min(1, "Họ và tên không được để trống"),
    phone_number: z.string().min(10, "Số điện thoại không hợp lệ"),
    date_of_birth: z.string().min(1, "Ngày sinh không được để trống"),
    license_number: z.string().optional(),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải ít nhất 6 ký tự"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Bạn phải đồng ý điều khoản" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });
