"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Loader2, Save, Clock, Eye, Send } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextContent } from "@/components/admin/RichTextContent";
import { createNews, uploadNewsImage, NewsArticle } from "@/apis/newsApi";

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

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  author: z.string().min(2, {
    message: "Tên tác giả phải có ít nhất 2 ký tự",
  }),
  excerpt: z.string().min(20, {
    message: "Tóm tắt phải có ít nhất 20 ký tự",
  }),
  content: z.string().min(100, {
    message: "Nội dung phải có ít nhất 100 ký tự",
  }),
  category: z.string({
    required_error: "Vui lòng chọn danh mục",
  }),
  tags: z.string().optional(),
  featuredImage: z.any().optional(),
  publishDate: z.date({
    required_error: "Vui lòng chọn ngày đăng",
  }),
  publishTime: z.string().min(1, {
    message: "Vui lòng nhập thời gian đăng",
  }),
  isFeatured: z.boolean().default(false),
  isDraft: z.boolean().default(true),
});

export function NewsEditor() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [previewData, setPreviewData] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      publishDate: new Date(),
      publishTime: format(new Date(), "HH:mm"),
      isFeatured: false,
      isDraft: true,
    },
  });

  // Prevent form submission when buttons are clicked in child components
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Only let the form submit through the explicit form.handleSubmit calls
    if (e.target instanceof HTMLButtonElement && !e.target.hasAttribute('form-submit')) {
      e.preventDefault();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Process featured image if present
      let imageUrl = "";
      if (values.featuredImage) {
        if (values.featuredImage instanceof File) {
          // Trường hợp 1: featuredImage là File object
          const imageData = await uploadNewsImage(values.featuredImage);
          imageUrl = imageData.public_url;
        } else if (typeof values.featuredImage === 'string') {
          // Trường hợp 2: featuredImage là data URL (Base64)
          if (values.featuredImage.startsWith('data:image')) {
            // Chuyển đổi Base64 thành File
            try {
              // Tách phần header và data của Base64
              const arr = values.featuredImage.split(',');
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
              const imageData = await uploadNewsImage(file);
              imageUrl = imageData.public_url;
            } catch (error) {
              console.error("Lỗi khi chuyển đổi Base64 sang File:", error);
              // Nếu không thể chuyển đổi, vẫn sử dụng URL Base64 (không được khuyến nghị cho production)
              imageUrl = values.featuredImage;
            }
          } else if (values.featuredImage.startsWith('https://storage.googleapis.com')) {
            // Trường hợp 3: featuredImage đã là Google Cloud URL
            imageUrl = values.featuredImage;
          }
        }
      }

      // Process content images
      let processedContent = values.content;
      const imageUrls = extractImageUrls(values.content);
      
      if (imageUrls.length > 0) {
        // Create a map to track original URLs and their cloud replacements
        const urlMap: Record<string, string> = {};
        
        // Upload each image to Google Cloud
        for (const url of imageUrls) {
          const file = await urlToFile(url);
          if (file) {
            const uploadResult = await uploadNewsImage(file);
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

      // Prepare news data with processed content
      const newsData: NewsArticle = {
        title: values.title,
        content: processedContent, // Use processed content with cloud storage URLs
        author: values.author,
        summary: values.excerpt,
        category: values.category,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        image_url: imageUrl,
        featured: values.isFeatured,
        publishDate: format(values.publishDate, "yyyy-MM-dd"),
        publishTime: values.publishTime,
        status: values.isDraft ? "draft" : "published"
      };

      // Create the news article
      const response = await createNews(newsData);
      
      toast({
        title: values.isDraft
          ? "Bài viết đã được lưu nháp"
          : "Bài viết đã được đăng",
        description: values.isDraft
          ? "Bạn có thể tiếp tục chỉnh sửa bài viết này sau"
          : "Bài viết đã được đăng thành công và hiển thị trên trang tin tức",
      });

      // Redirect to admin news page
      router.push("/admin/news");
      
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast({
        title: "Đã xảy ra lỗi",
        description: "Không thể tạo bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePreview() {
    const values = form.getValues();
    setPreviewData(values);
    setActiveTab("preview");
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Soạn thảo
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="flex items-center gap-2"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4" />
            Xem trước
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              form.setValue("isDraft", true);
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting && form.getValues("isDraft") ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu nháp</span>
            )}
          </Button>
          <Button
            onClick={() => {
              form.setValue("isDraft", false);
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting && !form.getValues("isDraft") ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Đang đăng...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                <span>Đăng bài</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <TabsContent value="edit" className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề bài viết</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề bài viết"
                              className="text-lg font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tác giả</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên tác giả" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tóm tắt bài viết</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập tóm tắt ngắn gọn về bài viết (sẽ hiển thị ở trang danh sách tin tức)"
                              className="min-h-24 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tóm tắt ngắn gọn về nội dung bài viết
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ảnh đại diện bài viết</FormLabel>
                          <div className="flex flex-col items-center">
                            <FormControl>
                              <ImageUploader
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormDescription className="text-center">
                            Tải lên ảnh đại diện cho bài viết. Kích thước khuyến
                            nghị: 1200x630px
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nội dung bài viết</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Giao thông">
                                Tình hình giao thông
                              </SelectItem>
                              <SelectItem value="Tai nạn">Tai nạn</SelectItem>
                              <SelectItem value="Công trình">
                                Công trình
                              </SelectItem>
                              <SelectItem value="Quy định">
                                Quy định mới
                              </SelectItem>
                              <SelectItem value="Thời tiết">Thời tiết</SelectItem>
                              <SelectItem value="Khác">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Thẻ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập các thẻ, phân cách bằng dấu phẩy"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ví dụ: giao thông, ùn tắc, đường vành đai
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="publishDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày đăng</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: vi })
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
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
                      name="publishTime"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Thời gian đăng</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Tin nổi bật</FormLabel>
                            <FormDescription>
                              Đánh dấu bài viết này là tin nổi bật
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="isDraft"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                          <div className="space-y-0.5">
                            <FormLabel>Lưu nháp</FormLabel>
                            <FormDescription>
                              Lưu bài viết dưới dạng nháp (chưa đăng)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        {previewData ? (
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
            <div className="prose max-w-none">
              <h1 className="text-4xl font-bold mb-6">{previewData.title}</h1>
              <p className="lead italic text-gray-800">{previewData.excerpt}</p>
              <p className="text-sm text-gray-600 mt-8 text-right">
                Thời gian: {previewData.publishTime} -{" "}
                {format(previewData.publishDate, "dd/MM/yyyy", { locale: vi })}
              </p>
              <RichTextContent content={previewData.content} className="mt-4" />
              {previewData.author && (
                <p className="text-sm text-gray-600 mt-8 text-right italic">
                  Tác giả: {previewData.author}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 text-center">
            <p className="text-gray-500">
              Nhấn nút &quot;Xem trước&quot; để xem bản xem trước của bài viết
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
