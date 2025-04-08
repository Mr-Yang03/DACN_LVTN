"use client";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    CalendarIcon,
    Eye,
    ChevronRight,
    Search,
} from "lucide-react"
import {
    PaginationDemo
} from "@/components/sections/pagination-demo"

const Page: React.FC = () => {
    const [currentNewsPage, setCurrentNewsPage] = useState(1)
    const newsPerPage = 4 // Số lượng tin tức hiển thị trên mỗi trang

    // Dữ liệu mẫu cho tin tức
    const newsItems = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Ứng dụng AI trong việc phân tích luồng giao thông tại các nút giao cắt ${i + 1}`,
        date: "24/03/2025",
        category: "Giao thông",
        description:
        "Công nghệ AI đang được ứng dụng để phân tích và tối ưu hóa luồng giao thông tại các nút giao cắt phức tạp.",
        views: 856 + i * 10,
        image: `/placeholder.svg?height=360&width=640&text=Tin tức ${i + 1}`,
    }))

    // Tính toán tin tức hiển thị trên trang hiện tại
    const indexOfLastNews = currentNewsPage * newsPerPage
    const indexOfFirstNews = indexOfLastNews - newsPerPage
    const currentNewsItems = newsItems.slice(indexOfFirstNews, indexOfLastNews)

    // Hàm xử lý khi người dùng chuyển trang tin tức
    const handleNewsPageChange = (page: number) => {
        setCurrentNewsPage(page)
        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({ top: document.getElementById("news-list")?.offsetTop || 0, behavior: "smooth" })
    }

    return (
        <>
            {/* <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[center_top_-1px]" />
                <div
                    className="absolute inset-0 bg-[url('/image/images.jpg?height=600&width=1200')] bg-cover bg-center"
                />

                <div className="container relative z-10 py-12">
                    <div className="max-w-2xl m-10 p-10 bg-gray-400 bg-opacity-80 rounded-lg">
                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                            Cập nhật tin tức giao thông mới nhất
                        </h1>
                        <p className="mt-4 text-lg text-blue-100">
                            Thông tin về tình hình giao thông, sự cố, công trình và các quy định mới
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/feedback">
                                    Gửi phản ánh
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                                <Link href="/map">Xem bản đồ giao thông</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main News Section */}
                    <div className="w-full md:w-2/3 ">
                        <div className="bg-white px-4 pt-4 pb-1 rounded-xl shadow-md mb-8">

                        <h2 className="text-2xl font-semibold mb-6">Tin tức mới nhất</h2>

                        {/* Featured News */}
                        <div className="mb-8">
                            <Card className="bg-white border-gray-200 overflow-hidden rounded-xl">
                                <div className="relative h-[300px] w-full">
                                    <Image
                                        src="/placeholder.svg?height=600&width=1200"
                                        alt="Hệ thống giám sát giao thông thông minh mới"
                                        fill
                                        className="object-cover"
                                        />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-800 mb-3">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>24/03/2025</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>1,234 lượt xem</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Hệ thống giám sát giao thông thông minh mới được triển khai tại TP.HCM
                                    </h3>
                                    <p className="text-gray-900 mb-4">
                                        Hệ thống giám sát giao thông thông minh mới nhất đã được triển khai tại các tuyến đường trọng điểm
                                        của TP.HCM, giúp giảm thiểu tình trạng ùn tắc và nâng cao hiệu quả quản lý giao thông đô thị.
                                    </p>
                                    <Button variant="outline" className="border-blue-600 text-blue-500 hover:bg-blue-900/20 rounded-full">
                                        Đọc tiếp
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                                        </div>
                        {/* News Categories Tabs */}
                        <Tabs defaultValue="all" className="mb-8  bg-white p-4 rounded-xl shadow-md">
                            <TabsList className="bg-white border border-gray-200 rounded-full w-full flex justify-center shadow-sm">
                                <TabsTrigger value="all" className="rounded-full">Tất cả</TabsTrigger>
                                <TabsTrigger value="traffic" className="rounded-full">Giao thông</TabsTrigger>
                                <TabsTrigger value="technology" className="rounded-full">Công nghệ</TabsTrigger>
                                <TabsTrigger value="policy" className="rounded-full">Chính sách</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-6">
                                <div id="news-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentNewsItems.map((item) => (
                                        <Card key={item.id} className="bg-white border-gray-200 overflow-hidden">
                                            <div className="relative h-[180px] w-full">
                                                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4 text-xs text-gray-800 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        <span>{item.date}</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-white bg-blue-600">
                                                        {item.category}
                                                    </Badge>
                                                </div>
                                                <h3 className="text-base font-medium mb-2">{item.title}</h3>
                                                <p className="text-gray-800 text-sm line-clamp-2">{item.description}</p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                                <div className="flex items-center gap-1 text-xs text-gray-800">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{item.views} lượt xem</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-500 p-0 h-auto hover:bg-transparent hover:text-blue-400"
                                                >
                                                    Đọc tiếp <ChevronRight className="h-3 w-3 ml-1" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>

                                <PaginationDemo
                                    totalItems={newsItems.length}
                                    itemsPerPage={newsPerPage}
                                    currentPage={currentNewsPage}
                                    onPageChange={handleNewsPageChange}
                                    className="mt-8"
                                />
                            </TabsContent>

                            <TabsContent value="traffic" className="mt-6">
                                <div className="text-center py-8 text-gray-800">Đang tải dữ liệu tin tức về giao thông...</div>
                            </TabsContent>

                            <TabsContent value="technology" className="mt-6">
                                <div className="text-center py-8 text-gray-800">Đang tải dữ liệu tin tức về công nghệ...</div>
                            </TabsContent>

                            <TabsContent value="policy" className="mt-6">
                                <div className="text-center py-8 text-gray-800">Đang tải dữ liệu tin tức về chính sách...</div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-1/3">
                        {/* Search */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tin tức..."
                                    className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <Button className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-600 rounded-full">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-blue-600 hover:bg-blue-700">Giao thông thông minh</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">AI</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">Camera giám sát</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">Đô thị thông minh</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">Phân tích dữ liệu</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">IoT</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">Hạ tầng</Badge>
                            </div>
                        </div>

                        {/* Popular News */}
                        <div className="mb-8  bg-white p-4 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold mb-4">Tin tức nổi bật</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex gap-3">
                                        <div className="relative h-16 w-16 flex-shrink-0">
                                            <Image
                                                src={`/placeholder.svg?height=64&width=64&text=${item}`}
                                                alt={`Tin nổi bật ${item}`}
                                                fill
                                                className="object-cover rounded border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium line-clamp-2">
                                                Hệ thống đèn giao thông thông minh giúp giảm 30% thời gian di chuyển
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-800">
                                                <CalendarIcon className="h-3 w-3" />
                                                <span>22/03/2025</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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