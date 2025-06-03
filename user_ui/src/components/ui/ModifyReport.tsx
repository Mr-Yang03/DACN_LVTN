"use client";

import { useState, useEffect } from "react";
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
import FileUploader from "@/components/ui/fileUploader";
import { useRouter } from "next/navigation";
import { LocationPicker } from "@/app/feedback/location-picker";
import { feedbackSchema } from "@/validations/feedbackSchema";
import { toast } from "@/components/ui/use-toast";
import { updateFeedback, uploadFeedbackFiles, getFeedback } from "@/apis/feedbackApi";
import { parse } from "date-fns";

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

// Add this utility function to get the auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

interface ModifyReportProps {
  id: string;
  onSubmitSuccess?: () => void;
}

export function ModifyReport({ id, onSubmitSuccess }: ModifyReportProps ) {
  console.log(id);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalImageUrl, setOriginalImageUrl] = useState<string[] | null>(null);
  
  const [feedbackItem, setFeedbackItem] = useState({
      _id: "",
      title: "",
      location: "",
      type: "",
      severity: "",
      description: "",
      images: [],
      author: "",
      author_username: "",
      phone_number: "",
      email: "",
      date: "",
      time: "",
  })

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: {
        lat: 0,
        lng: 0,
      },
      date: new Date(),
      time: getCurrentTime(),
      issueType: "",
      severity: "low",
      description: "",
      attachments: [],
    },
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);

        const data = await getFeedback(id);
        if (data) {
          setFeedbackItem(data.data);
          setOriginalImageUrl(data.data.images);
          form.reset({
            fullName: data.data.author,
            email: data.data.email,
            phone: data.data.phone_number,
            location: {
              lat: Number(data.data.location.split(",")[0]),
              lng: Number(data.data.location.split(",")[1]),
            },
            date: parse(data.data.date, "dd-MM-yyyy", new Date()),
            time: data.data.time,
            issueType: data.data.type,
            severity: data.data.severity === "Nhẹ" ? "low" :
                      data.data.severity === "Trung bình" ? "medium" : "high",
            description: data.data.description,
            // attachments: data.data.images,
          });
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải phản ánh. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [id, form, toast]);

  console.log("Feedback data:", feedbackItem);

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    console.log("Form values on submit:", values);

    // Array to store uploaded file URLs
    let uploadedFileUrls = originalImageUrl || [];

    // Process files if present
    if (values.attachments && values.attachments.length > 0) {
      const filesToUpload: File[] = [];

      // Process each file
      for (const file of values.attachments) {
        if (file instanceof File) {
          // Case 1: Already a File object
          filesToUpload.push(file);
        } else if (typeof file === 'string') {
          // Case 2: It's a data URL (Base64)
          if (file.startsWith('data:')) {
            try {
              // Extract MIME type and data from Base64
              const arr = file.split(',');
              const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              
              // Create File from Base64 data
              const fileObj = new File(
                [u8arr], 
                `feedback-file-${Date.now()}.${mime.split('/')[1] || 'jpg'}`, 
                { type: mime }
              );
              
              filesToUpload.push(fileObj);
            } catch (error) {
              console.error("Error converting Base64 to File:", error);
            }
          } else if (file.startsWith('https://storage.googleapis.com')) {
            // Case 3: Already a Google Cloud URL
            uploadedFileUrls.push(file);
          }
        }
      }

      console.log("Files to upload:", filesToUpload);

      // Upload all files in a single request if there are any to upload
      if (filesToUpload.length > 0) {
        const uploadResult = await uploadFeedbackFiles(filesToUpload);
        
        // Extract URLs from the response
        if (uploadResult && uploadResult.uploaded_files) {
          const newUrls = uploadResult.uploaded_files.map((item: any) => item.public_url);
          uploadedFileUrls = [...uploadedFileUrls, ...newUrls];
        }
      }
    }

    try {
      const feedbackData = {
        title: `Phản ánh về ${values.issueType === 'traffic_jam' ? 'tắc đường' : 
                values.issueType === 'accident' ? 'tai nạn' : 
                values.issueType === 'construction' ? 'công trình đang thi công' :
                values.issueType === 'road_damage' ? 'hư hỏng đường' :
                values.issueType === 'traffic_light' ? 'đèn tín hiệu hỏng' :
                values.issueType === 'flooding' ? 'ngập nước' : 'vấn đề khác'}`,
        location: `${values.location.lat}, ${values.location.lng}`, // Convert location object to string format
        type: values.issueType,
        severity: values.severity === 'low' ? 'Nhẹ' : 
                  values.severity === 'medium' ? 'Trung bình' : 'Nghiêm trọng',
        description: values.description,
        images: uploadedFileUrls,
        author: values.fullName, 
        author_username: feedbackItem.author_username,
        phone_number: values.phone,
        email: values.email,
        date: format(values.date, "dd-MM-yyyy"),
        time: values.time,
      };

      const response = await updateFeedback(feedbackItem._id, feedbackData);      
      if (response) {
        setIsSuccess(true);
        toast?.({
          title: "Phản ánh đã được cập nhật",
          description: "Cảm ơn bạn đã phản ánh về tình trạng giao thông.",
          variant: "default"
        });
        
        // Call the onSubmitSuccess callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        // router.push("/feedback");
        window.location.reload();
      }
    
    } catch (error) {
      console.error("Lỗi khi gửi phản ánh:", error);
      toast?.({
        title: "Có lỗi xảy ra",
        description: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    <Input placeholder="Họ và tên" {...field}/>
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
                    <Input placeholder="Số điện thoại" {...field}/>
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại vấn đề" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tắc đường">Tắc đường</SelectItem>
                      <SelectItem value="Tai nạn giao thông">Tai nạn giao thông</SelectItem>
                      <SelectItem value="Công trình đang thi công">
                        Công trình đang thi công
                      </SelectItem>
                      <SelectItem value="Hư hỏng đường">Hư hỏng đường</SelectItem>
                      <SelectItem value="Đèn tín hiệu hỏng">
                        Đèn tín hiệu hỏng
                      </SelectItem>
                      <SelectItem value="Ngập nước">Ngập nước</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
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
                      value={field.value}
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
            {isSubmitting ? "Đang gửi..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
