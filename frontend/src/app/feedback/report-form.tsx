"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { toast } from "@/components/ui/use-toast";
import FileUploader from "@/components/ui/fileUploader";
import { useRouter } from "next/navigation";
import { LocationPicker } from "@/app/feedback/location-picker";

const formSchema = z.object({
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

export function ReportForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: {
        lat: 0,
        lng: 0,
      },
      date: new Date(),
      time: "",
      issueType: "",
      severity: "medium",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSuccess(true);
      // toast({
      //   title: "Phản ánh đã được gửi",
      //   description: "Cảm ơn bạn đã gửi phản ánh về tình trạng giao thông",
      // });
      router.push("/thanks");
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border-2 p-4 bg-white shadow-lg">
          <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border-2 p-4 bg-white shadow-lg">
          <h2 className="text-lg font-semibold">Thông tin sự cố</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <LocationPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Chọn vị trí trên bản đồ
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày xảy ra</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại vấn đề</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại vấn đề" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="traffic_jam">Tắc đường</SelectItem>
                      <SelectItem value="accident">Tai nạn</SelectItem>
                      <SelectItem value="construction">
                        Công trình đang thi công
                      </SelectItem>
                      <SelectItem value="road_damage">Hư hỏng đường</SelectItem>
                      <SelectItem value="traffic_light">
                        Đèn tín hiệu hỏng
                      </SelectItem>
                      <SelectItem value="flooding">Ngập nước</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức độ nghiêm trọng</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Nhẹ</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Trung bình
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Nghiêm trọng
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về tình trạng giao thông..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Hình ảnh/Video đính kèm</FormLabel>
                  <FormControl>
                    <FileUploader field={field} />
                  </FormControl>
                  <FormDescription>
                    Tải lên hình ảnh hoặc video để minh họa tình trạng giao
                    thông
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 flex items-start space-x-3 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Lưu ý</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Vui lòng cung cấp thông tin chính xác để giúp chúng tôi xử lý phản
              ánh hiệu quả. Thông tin cá nhân của bạn sẽ được bảo mật theo quy
              định.
            </p>
          </div>
        </div>

        <div className="flex justify-end ">
          <Button type="submit" disabled={isSubmitting} className="shadow-lg">
            {isSubmitting ? "Đang gửi..." : "Gửi phản ánh"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
