"use client";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    CalendarIcon,
    Eye,
    ChevronRight,
    Search,
    ArrowRight,
    Loader2
} from "lucide-react"
import {
    PaginationDemo
} from "@/components/sections/pagination-demo"
import { useToast } from "@/hooks/use-toast"
import { getPublicNews, getNewsByCategory, getNewsById, getFeaturedNews, NewsArticle } from "@/apis/newsApi"
import { useRouter } from "next/navigation"

const Page: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [currentNewsPage, setCurrentNewsPage] = useState(1);
    const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
    const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null);
    const [popularNews, setPopularNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPopular, setIsLoadingPopular] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorPopular, setErrorPopular] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryNewsMap, setCategoryNewsMap] = useState<Record<string, NewsArticle[]>>({
        traffic: [],
        accident: [],
        regulation: [],
        construction: [],
        weather: [],
        other: []
    });
    const [categoryLoading, setCategoryLoading] = useState<Record<string, boolean>>({
        traffic: false,
        accident: false,
        regulation: false,
        construction: false,
        weather: false,
        other: false
    });
    const newsPerPage = 4; // Số lượng tin tức hiển thị trên mỗi trang

    // Mapping from tab value to actual category name in backend
    const categoryMapping: Record<string, string> = {
        'traffic': 'Giao thông',
        'accident': 'Tai nạn',
        'regulation': 'Quy định',
        'construction': 'Công trình',
        'weather': 'Thời tiết',
        'other': 'Khác'
    };

    // Tải dữ liệu tin tức từ API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Gọi API để lấy danh sách tin tức
                const newsData = await getPublicNews();
                
                // Lọc ra tin nổi bật đầu tiên
                const featured = newsData.find((item: NewsArticle) => item.featured && item.status === 'published');
                if (featured) {
                    setFeaturedNews(featured);
                    // Loại bỏ tin nổi bật khỏi danh sách chính
                    setNewsItems(newsData.filter((item: NewsArticle) => item._id !== featured._id && item.status === 'published'));
                } else {
                    // Nếu không có tin nổi bật, lấy tin mới nhất làm tin nổi bật
                    const latestNews = [...newsData].sort((a: NewsArticle, b: NewsArticle) => 
                        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                    )[0];
                    
                    if (latestNews) {
                        setFeaturedNews(latestNews);
                        setNewsItems(newsData.filter((item: NewsArticle) => item._id !== latestNews._id && item.status === 'published'));
                    } else {
                        setNewsItems(newsData.filter((item: NewsArticle) => item.status === 'published'));
                    }
                }
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

    // Tải dữ liệu tin tức nổi bật
    useEffect(() => {
        const fetchFeaturedNews = async () => {
            try {
                setIsLoadingPopular(true);
                setErrorPopular(null);
                
                // Fetch featured news with a limit of 4 items
                const featuredNewsData = await getFeaturedNews(4);
                setPopularNews(featuredNewsData.filter((item: NewsArticle) => item.status === 'published'));
            } catch (err) {
                console.error('Failed to fetch featured news:', err);
                setErrorPopular('Không thể tải tin tức nổi bật.');
            } finally {
                setIsLoadingPopular(false);
            }
        };

        fetchFeaturedNews();
    }, []);

    // Hàm để tải dữ liệu cho một danh mục cụ thể
    const fetchCategoryNews = async (category: string) => {
        if (categoryNewsMap[category].length > 0) {
            // Already loaded
            return;
        }

        try {
            setCategoryLoading(prev => ({ ...prev, [category]: true }));
            
            const backendCategory = categoryMapping[category];
            const newsData = await getNewsByCategory(backendCategory);
            
            setCategoryNewsMap(prev => ({
                ...prev,
                [category]: newsData.filter((item: NewsArticle) => item.status === 'published')
            }));
        } catch (err) {
            console.error(`Failed to fetch ${category} news:`, err);
            toast({
                variant: 'destructive',
                title: 'Lỗi',
                description: `Không thể tải dữ liệu tin tức loại ${categoryMapping[category]}. Vui lòng thử lại sau.`,
            });
        } finally {
            setCategoryLoading(prev => ({ ...prev, [category]: false }));
        }
    };

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveCategory(value);
        if (value !== 'all') {
            fetchCategoryNews(value);
        }
        setCurrentNewsPage(1); // Reset page to 1 when switching tabs
    };
            
    // Lọc tin tức theo danh mục
    const filteredNews = activeCategory === "all"
        ? newsItems
        : categoryNewsMap[activeCategory];

    // Tính toán tin tức hiển thị trên trang hiện tại
    const indexOfLastNews = currentNewsPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNewsItems = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

    // Hàm xử lý khi người dùng chuyển trang tin tức
    const handleNewsPageChange = (page: number) => {
        setCurrentNewsPage(page);
        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({ top: document.getElementById("news-list")?.offsetTop || 0, behavior: "smooth" });
    };

    // Hàm xử lý tìm kiếm để chuyển hướng đến trang tìm kiếm
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (searchTerm.trim()) {
            // Chuyển hướng đến trang tìm kiếm với query parameter
            router.push(`/news/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    // Hàm để chọn tag làm từ khoá tìm kiếm và chuyển hướng đến trang tìm kiếm
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

    // Hàm để xóa từ khóa tìm kiếm
    const clearSearch = () => {
        setSearchTerm("");
        setCurrentNewsPage(1);
    };

    // Render tin tức
    const renderNewsGrid = (newsItems: NewsArticle[]) => (
        <>
            <div id="news-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                totalItems={filteredNews.length}
                itemsPerPage={newsPerPage}
                currentPage={currentNewsPage}
                onPageChange={handleNewsPageChange}
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

    // Render error state
    const renderError = (errorMessage: string) => (
        <div className="text-center py-12 text-red-500">
            <p>{errorMessage}</p>
            <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
            >
                Thử lại
            </Button>
        </div>
    );



    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main News Section */}
                    <div className="w-full md:w-2/3 ">
                        <div className="bg-white px-4 pt-4 pb-1 rounded-xl shadow-md mb-8">

                        <h2 className="text-2xl font-semibold mb-6">Tin tức mới nhất</h2>

                        {/* Featured News */}
                        <div className="mb-8">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-6 text-red-500">
                                    <p>{error}</p>
                                </div>
                            ) : featuredNews ? (
                                <Card className="bg-white border-gray-200 overflow-hidden rounded-xl">
                                    <div className="relative h-[300px] w-full">
                                        <Link href={`/news/${featuredNews._id}`}>
                                            <Image
                                                src={featuredNews.image_url || "/placeholder.svg?height=600&width=1200"}
                                                alt={featuredNews.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-800 mb-3">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{featuredNews.publishDate || new Date(featuredNews.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            {featuredNews.category && (
                                                <Badge variant="outline" className="text-white bg-blue-600">
                                                    {featuredNews.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <Link href={`/news/${featuredNews._id}`} className="hover:text-blue-500 transition-colors">
                                            <h3 className="text-xl font-bold mb-2">
                                                {featuredNews.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-900 mb-4">
                                            {featuredNews.summary || featuredNews.content?.substring(0, 200) + "..."}
                                        </p>
                                        <Button 
                                            variant="outline" 
                                            className="border-blue-600 text-blue-500 hover:bg-blue-900/20 rounded-full"
                                            asChild
                                        >
                                            <Link href={`/news/${featuredNews._id}`}>
                                                Đọc tiếp
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <p>Không có tin tức nổi bật</p>
                                </div>
                            )}
                        </div>
                        </div>
                        {/* News Categories Tabs */}
                        <Tabs defaultValue="all" className="mb-8 bg-white p-4 rounded-xl shadow-md" onValueChange={handleTabChange}>
                            <TabsList className="bg-white border border-gray-200 rounded-full w-full flex justify-center shadow-sm">
                                <TabsTrigger value="all" className="rounded-full">Tất cả</TabsTrigger>
                                <TabsTrigger value="traffic" className="rounded-full">Giao thông</TabsTrigger>
                                <TabsTrigger value="accident" className="rounded-full">Tai nạn</TabsTrigger>
                                <TabsTrigger value="regulation" className="rounded-full">Quy định</TabsTrigger>
                                <TabsTrigger value="construction" className="rounded-full">Công trình</TabsTrigger>
                                <TabsTrigger value="weather" className="rounded-full">Thời tiết</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-6">
                                {isLoading ? renderLoading() : 
                                 error ? renderError(error) : 
                                 renderNewsGrid(currentNewsItems)}
                            </TabsContent>

                            <TabsContent value="traffic" className="mt-6">
                                {categoryLoading.traffic ? renderLoading() : 
                                 categoryNewsMap.traffic.length === 0 ? 
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nào về Giao thông</div> : 
                                    renderNewsGrid(currentNewsItems)}
                            </TabsContent>

                            <TabsContent value="accident" className="mt-6">
                                {categoryLoading.accident ? renderLoading() : 
                                 categoryNewsMap.accident.length === 0 ? 
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nào về Tai nạn</div> : 
                                    renderNewsGrid(currentNewsItems)}
                            </TabsContent>

                            <TabsContent value="regulation" className="mt-6">
                                {categoryLoading.regulation ? renderLoading() : 
                                 categoryNewsMap.regulation.length === 0 ? 
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nào về Quy định</div> : 
                                    renderNewsGrid(currentNewsItems)}
                            </TabsContent>

                            <TabsContent value="construction" className="mt-6">
                                {categoryLoading.construction ? renderLoading() : 
                                 categoryNewsMap.construction.length === 0 ? 
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nào về Công trình</div> : 
                                    renderNewsGrid(currentNewsItems)}
                            </TabsContent>

                            <TabsContent value="weather" className="mt-6">
                                {categoryLoading.weather ? renderLoading() : 
                                 categoryNewsMap.weather.length === 0 ? 
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nào về Thời tiết</div> : 
                                    renderNewsGrid(currentNewsItems)}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-1/3">
                        {/* Search */}
                        <div className="mb-8">
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
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge 
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => handleTagClick("Giao thông")}
                                >
                                    Giao thông
                                </Badge>
                                <Badge 
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => handleTagClick("Đô thị")}
                                >
                                    Đô thị
                                </Badge>
                                <Badge 
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => handleTagClick("Phân tích dữ liệu")}
                                >
                                    Phân tích dữ liệu
                                </Badge>
                                <Badge 
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => handleTagClick("IoT")}
                                >
                                    IoT
                                </Badge>
                                <Badge 
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => handleTagClick("Hạ tầng")}
                                >
                                    Hạ tầng
                                </Badge>
                            </div>
                        </div>

                        {/* Popular News */}
                        <div className="mb-8  bg-white p-4 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold mb-4">Tin tức nổi bật</h3>
                            <div className="space-y-4">
                                {isLoadingPopular ? (
                                    renderLoading()
                                ) : errorPopular ? (
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nổi bật</div>
                                ) : popularNews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-600">Không có tin tức nổi bật</div>
                                ) : (
                                    popularNews.map((item) => (
                                        <div key={item._id} className="flex gap-3">
                                            <Link href={`/news/${item._id}`} className="relative h-16 w-16 flex-shrink-0">
                                                <Image
                                                    src={item.image_url || "/placeholder.svg?height=64&width=64"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover rounded border-gray-200"
                                                />
                                            </Link>
                                            <div>
                                                <Link href={`/news/${item._id}`} className="hover:text-blue-500 transition-colors">
                                                    <h4 className="text-sm font-medium line-clamp-2">
                                                        {item.title}
                                                    </h4>
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-800">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>{item.publishDate || new Date(item.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                            <h3 className="text-lg font-bold mb-2">Đăng ký nhận tin</h3>
                            <p className="text-gray-800 text-sm mb-4">
                                Nhận thông báo về các tin tức mới nhất về giao thông thông minh
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="w-full bg-white border border-gray-700 rounded-md py-2 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">Đăng ký</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;