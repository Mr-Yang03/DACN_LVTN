"use client";

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    CalendarIcon,
    ChevronRight,
    Search,
    ArrowLeft,
    Loader2
} from "lucide-react"
import {
    PaginationDemo
} from "@/components/sections/pagination-demo"
import { useToast } from "@/hooks/use-toast"
import { getPublicNews, NewsArticle } from "@/apis/newsApi"
import { useSearchParams, useRouter } from 'next/navigation'

const SearchPage: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [currentPage, setCurrentPage] = useState(1);
    const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(query);
    const newsPerPage = 8; // Hiển thị nhiều tin hơn ở trang tìm kiếm

    // Tải dữ liệu tin tức từ API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Gọi API để lấy danh sách tin tức
                const newsData = await getPublicNews();
                setNewsItems(newsData.filter((item: NewsArticle) => item.status === 'published'));
            } catch (err) {
                console.error('Failed to fetch news:', err);
                setError('Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.');
                toast({
                    variant: 'destructive',
                    title: 'Lỗi',
                    description: 'Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [toast]);

    // Lọc tin tức theo từ khóa tìm kiếm
    const searchedNews = query 
        ? newsItems.filter(item => 
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.content?.toLowerCase().includes(query.toLowerCase()) ||
            item.summary?.toLowerCase().includes(query.toLowerCase()) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
          )
        : [];

    // Tính toán tin tức hiển thị trên trang hiện tại
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNewsItems = searchedNews.slice(indexOfFirstNews, indexOfLastNews);

    // Hàm xử lý khi người dùng chuyển trang tin tức
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({ top: document.getElementById("search-results")?.offsetTop || 0, behavior: "smooth" });
    };

    // Hàm xử lý tìm kiếm mới
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/news/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    // Hàm để xóa từ khóa tìm kiếm
    const clearSearch = () => {
        setSearchTerm("");
    };

    // Quay lại trang tin tức
    const goBackToNews = () => {
        router.push("/news");
    };

    // Render tin tức
    const renderNewsGrid = (newsItems: NewsArticle[]) => (
        <>
            <div id="search-results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsItems.map((item) => (
                    <Card key={item._id} className="bg-white border-gray-200 overflow-hidden">
                        <div className="relative h-[180px] w-full">
                            <Link href={`/news/${item._id}`}>
                                <Image 
                                    src={item.image_url || "/placeholder.svg?height=360&width=640"} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover" 
                                />
                            </Link>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4 text-xs text-gray-800 mb-2">
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{item.publishDate || new Date(item.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <Badge variant="outline" className="text-white bg-blue-600">
                                    {item.category || "Chung"}
                                </Badge>
                            </div>
                            <Link href={`/news/${item._id}`} className="hover:text-blue-500 transition-colors">
                                <h3 className="text-base font-medium mb-2">{item.title}</h3>
                            </Link>
                            <p className="text-gray-800 text-sm line-clamp-2">
                                {item.summary || item.content?.substring(0, 150) + "..."}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 p-0 h-auto hover:bg-transparent hover:text-blue-400"
                                asChild
                            >
                                <Link href={`/news/${item._id}`}>
                                    Đọc tiếp <ChevronRight className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <PaginationDemo
                totalItems={searchedNews.length}
                itemsPerPage={newsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                className="mt-8"
            />
        </>
    );

    // Render loading state
    const renderLoading = () => (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
    );

    // Render empty state for search
    const renderEmptySearch = () => (
        <div className="text-center py-12 text-gray-600">
            <p>Không tìm thấy kết quả phù hợp với từ khóa &quot;{query}&quot;</p>
            <Button 
                onClick={goBackToNews} 
                variant="outline" 
                className="mt-4"
            >
                Quay lại trang tin tức
            </Button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    className="flex items-center text-gray-600 hover:text-blue-600"
                    onClick={goBackToNews}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại tin tức
                </Button>
            </div>
                <h2 className="text-2xl font-semibold text-center pb-6">Tìm kiếm tin tức</h2>

            {/* Search bar */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tin tức..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-full py-3 pl-5 pr-20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md"
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
                            <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-blue-600 rounded-full">
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-center text-gray-800">
                    {query ? `Hiển thị ${searchedNews.length} kết quả cho tìm kiếm "${query}"` : 'Vui lòng nhập từ khóa tìm kiếm'}
                </p>
            </div>

            {/* Search Results */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                {isLoading ? renderLoading() : 
                 error ? (
                    <div className="text-center py-6 text-red-500">
                        <p>{error}</p>
                    </div>
                 ) : 
                 searchedNews.length === 0 ? renderEmptySearch() : 
                 renderNewsGrid(currentNewsItems)}
            </div>
        </div>
    );
};

export default SearchPage;
