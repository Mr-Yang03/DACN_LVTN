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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {newsDetail?.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-700 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {newsDetail?.created_at
                      ? formatDate(newsDetail.created_at)
                      : formatDate(
                          newsDetail?.publishDate,
                          newsDetail?.publishTime
                        )}
                  </span>
                </div>

                {newsDetail?.category && (
                  <Badge variant="outline" className="text-white bg-blue-600">
                    {newsDetail.category}
                  </Badge>
                )}
              </div>

              {newsDetail?.author && (
                <div className="ml-auto">
                  <span>Tác giả: {newsDetail.author}</span>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {newsDetail?.image_url && (
              <div className="relative h-[400px] w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={newsDetail.image_url}
                  alt={newsDetail.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Summary */}
            {newsDetail?.summary && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 italic text-gray-700">
                {newsDetail.summary}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: newsDetail?.content || "" }}
              />
            </div>

            {/* Tags */}
            {newsDetail?.tags && newsDetail.tags.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Thẻ:</h4>
                <div className="flex flex-wrap gap-2">
                  {newsDetail.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          {/* Popular Tags */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-600 hover:bg-blue-700">
                Giao thông thông minh
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700">AI</Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                Camera giám sát
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                Đô thị thông minh
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700">
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
