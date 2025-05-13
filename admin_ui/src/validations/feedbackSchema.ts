import { z } from "zod";

export const feedbackSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  date: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  time: z.string().min(1, {
    message: "Vui lòng nhập thời gian",
  }),
  issueType: z.string({
    required_error: "Vui lòng chọn loại vấn đề",
  }),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "Vui lòng chọn mức độ nghiêm trọng",
  }),
  description: z.string(),
  attachments: z.any().optional(),
});
