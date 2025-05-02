"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Loader2, Save, Clock, Eye, Send } from "lucide-react";
import { format, parse } from "date-fns";
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
import { getNewsById, updateNews, uploadNewsImage } from "@/apis/newsApi";

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
  excerpt: z.string().min(50, {
    message: "Tóm tắt phải có ít nhất 50 ký tự",
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

export interface ModifyNewsEditorProps {
  newsId?: string;
}

export function ModifyNewsEditor({ newsId }: ModifyNewsEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [previewData, setPreviewData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch news data when component mounts
  useEffect(() => {
    if (!newsId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchNews = async () => {
      try {
        const data = await getNewsById(newsId);

        if (data) {
          // Convert data from API to form schema format
          const formData = {
            title: data.title || "",
            author: data.author || "",
            excerpt: data.summary || "",
            content: data.content || "",
            category: data.category || "",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
            featuredImage: data.image_url || "",
            // Format date and time from API data
            publishDate: data.publishDate
              ? parse(data.publishDate, "dd/MM/yyyy", new Date())
              : new Date(),
            publishTime: data.publishTime || format(new Date(), "HH:mm"),
            isFeatured: data.featured || false,
            isDraft: data.status === "draft",
          };

          form.reset(formData);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin bài viết. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!newsId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID bài viết để cập nhật.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Process featured image if it's a File object
      let imageUrl = values.featuredImage;
      if (values.featuredImage instanceof File) {
        const imageData = await uploadNewsImage(values.featuredImage);
        imageUrl = imageData.public_url;
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

      // Convert form data to API data format
      const apiData = {
        title: values.title,
        author: values.author,
        summary: values.excerpt,
        content: processedContent, // Use processed content with cloud storage URLs
        category: values.category,
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
        image_url: imageUrl,
        publishDate: format(values.publishDate, "dd/MM/yyyy"),
        publishTime: values.publishTime,
        featured: values.isFeatured,
        status: values.isDraft ? "draft" : "published",
      };

      await updateNews(newsId, apiData);

      toast({
        title: values.isDraft
          ? "Bài viết đã được cập nhật và lưu nháp"
          : "Bài viết đã được cập nhật và đăng",
        description: values.isDraft
          ? "Bạn có thể tiếp tục chỉnh sửa bài viết này sau"
          : "Bài viết đã được cập nhật thành công và hiển thị trên trang tin tức",
      });

      if (!values.isDraft) {
        router.push("/admin/news");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast({
        title: "Lỗi cập nhật",
        description: "Đã xảy ra lỗi khi cập nhật bài viết. Vui lòng thử lại sau.",
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải thông tin bài viết...</span>
      </div>
    );
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
          >
            {isSubmitting && form.getValues("isDraft") ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Lưu nháp
          </Button>
          <Button
            onClick={() => {
              form.setValue("isDraft", false);
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && !form.getValues("isDraft") ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <Send className="mr-2 h-4 w-4" />
            Cập nhật
          </Button>
        </div>
      </div>

      <TabsContent value="edit" className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            Tóm tắt ngắn gọn về nội dung bài viết, giới hạn
                            khoảng 200-300 ký tự
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
                              <SelectItem value="traffic">
                                Tình hình giao thông
                              </SelectItem>
                              <SelectItem value="accident">Tai nạn</SelectItem>
                              <SelectItem value="construction">
                                Công trình
                              </SelectItem>
                              <SelectItem value="regulation">
                                Quy định mới
                              </SelectItem>
                              <SelectItem value="weather">Thời tiết</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
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

                    <FormField
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
                    />
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