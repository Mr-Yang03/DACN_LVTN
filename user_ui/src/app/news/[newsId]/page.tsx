"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPublicNewsById,
  getFeaturedNews,
  NewsArticle,
} from "@/apis/newsApi";
import {
  CalendarIcon,
  ChevronLeft,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextContent } from "@/components/admin/RichTextContent";

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const newsId = params.newsId as string;

  const [newsDetail, setNewsDetail] = useState<NewsArticle | null>(null);
  const [popularNews, setPopularNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) return;

      try {
        setIsLoading(true);
        setError(null);

        const newsData = await getPublicNewsById(newsId);

        if (!newsData) {
          throw new Error("Không tìm thấy bài viết");
        }

        setNewsDetail(newsData);
      } catch (err) {
        console.error("Failed to fetch news detail:", err);
        setError("Không thể tải chi tiết tin tức. Vui lòng thử lại sau.");
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải chi tiết tin tức. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId, toast]);

  // Fetch popular news
  useEffect(() => {
    const fetchPopularNews = async () => {
      try {
        setIsLoadingPopular(true);
        setErrorPopular(null);
        
        // Fetch featured news with a limit of 3 items
        const popularNewsData = await getFeaturedNews(3);
        
        // Filter out the current news if it's in the popular list
        const filtered = popularNewsData.filter(
          (item: NewsArticle) => item._id !== newsId && item.status === "published"
        );
        
        setPopularNews(filtered);
      } catch (err) {
        console.error("Failed to fetch popular news:", err);
        setErrorPopular("Không thể tải tin tức phổ biến.");
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularNews();
  }, [newsId]);

  // Hàm xử lý tìm kiếm để chuyển hướng đến trang tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Chuyển hướng đến trang tìm kiếm với query parameter
      router.push(`/news/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Hàm để xóa từ khóa tìm kiếm
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Hàm để xử lý khi người dùng click vào tag
  const handleTagClick = (tagName: string) => {
    // Chuyển hướng đến trang tìm kiếm với query parameter
    router.push(`/news/search?q=${encodeURIComponent(tagName)}`);
    
    // Hiển thị thông báo
    toast({
      title: "Đã chọn chủ đề",
      description: `Chuyển đến kết quả tìm kiếm cho "${tagName}"`,
      duration: 3000,
    });
  };

  // Format date for display
  const formatDate = (dateString?: string | Date, timeString?: string) => {
    if (!dateString) return "";

    try {
      let date: Date;

      // Handle case where we have separate date and time strings
      if (timeString && typeof dateString === "string") {
        // Combine date and time for parsing
        const [day, month, year] = dateString.split("/");
        const [hours, minutes] = timeString.split(":");

        if (day && month && year && hours && minutes) {
          // Ensure all parts are valid before creating date
          date = new Date(
            parseInt(year),
            parseInt(month) - 1, // Month is 0-indexed
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
          );
        } else {
          date = new Date(dateString);
        }
      } else {
        // Handle case where we have a single datetime string or object
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "";
      }

      // Format as "HH:MM - DD/MM/YYYY"
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-[400px] w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <Button
            onClick={() => router.push("/news")}
            variant="outline"
            className="mt-4"
          >
            Quay lại trang tin tức
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-blue-500 p-0 h-auto hover:bg-transparent hover:text-blue-700"
          onClick={() => router.push("/news")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại trang tin tức
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="prose max-w-none">
                <h1 className="text-4xl font-bold mb-6">{newsDetail?.title}</h1>
                {newsDetail?.summary && (
                  <p className="lead italic text-gray-800">{newsDetail.summary}</p>
                )}
                <p className="text-sm text-gray-600 mt-8 text-right">
                  Ngày đăng: {newsDetail?.created_at
                    ? formatDate(newsDetail.created_at)
                    : `${newsDetail?.publishTime} - ${newsDetail?.publishDate}`}
                </p>
                <RichTextContent content={newsDetail?.content || ""} className="mt-4" />
                {newsDetail?.author && (
                  <p className="text-sm text-gray-600 mt-8 text-right italic">
                    Tác giả: {newsDetail.author}
                  </p>
                )}
              </div>

            {/* Tags */}
            {newsDetail?.tags && newsDetail.tags.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Thẻ:</h4>
                <span className="flex flex-wrap gap-2">
                  {newsDetail.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Tìm kiếm tin tức</h3>
            <div className="relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2 pl-4 pr-20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchTerm && (
                    <button 
                      type="button" 
                      onClick={clearSearch}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  )}
                  <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-blue-600 rounded-full">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleTagClick("Giao thông thông minh")}
              >
                Giao thông thông minh
              </Badge>
              <Badge 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleTagClick("AI")}
              >
                AI
              </Badge>
              <Badge 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleTagClick("Camera giám sát")}
              >
                Camera giám sát
              </Badge>
              <Badge 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleTagClick("Đô thị thông minh")}
              >
                Đô thị thông minh
              </Badge>
              <Badge 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleTagClick("Phân tích dữ liệu")}
              >
                Phân tích dữ liệu
              </Badge>
            </div>
          </div>

          {/* Popular News */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Tin tức phổ biến</h3>

            {isLoadingPopular ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : errorPopular ? (
              <p className="text-gray-500 text-center py-4">{errorPopular}</p>
            ) : popularNews.length > 0 ? (
              <div className="space-y-4">
                {popularNews.map((news) => (
                  <Link href={`/news/${news._id}`} key={news._id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex gap-3 p-3">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={
                              news.image_url ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={news.title}
                            fill
                            className="object-cover rounded border-gray-200"
                          />
                        </div>
                        <CardContent className="p-0">
                          <h4 className="text-sm font-medium line-clamp-2 hover:text-blue-600">
                            {news.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              {news.created_at
                                ? formatDate(news.created_at)
                                : formatDate(
                                    news.publishDate,
                                    news.publishTime
                                  )}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có tin tức phổ biến
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
