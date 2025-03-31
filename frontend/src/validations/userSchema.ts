import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullname: z.string().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
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
