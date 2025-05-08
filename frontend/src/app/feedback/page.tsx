"use client";

// import GoongMap from "@/components/ui/GoongMap";
import { ReportForm } from "./report-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  PaginationDemo
} from "@/components/sections/pagination-demo"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Filter,
  Search,
  Plus,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card} from "@/components/ui/card"
import { getUserFeedbackList } from "@/apis/feedbackApi";
import { useToast } from '@/hooks/use-toast';

export default function ReportPage() {
  const [severityFilter, setSeverityFilter] = useState("allSeverity")
  const [issueFilter, setIssueFilter] = useState("allIssueType")
  const [currentDate, setCurrentDate] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1)
  const [search, setSearch] = useState<string>("");
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]); // Dữ liệu phản ánh giả lập
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const itemsPerPage = 3 // Số lượng phản ánh hiển thị trên mỗi trang

  // Load data on component mount
  useEffect(() => {
    // Fetch feedback data from API
    const fetchFeedbackList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const feedbackData = await getUserFeedbackList();
        setFeedbackItems(feedbackData);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setError('Không thể tải dữ liệu phản ánh. Vui lòng thử lại sau.');
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu phản ánh. Vui lòng thử lại sau.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackList();
    const now = new Date();
    setCurrentDate(now.toISOString().split("T")[0]); // YYYY-MM-DD
  }, [toast]);

  console.log(feedbackItems)

  const filteredFeedbacks = feedbackItems.filter(feedback =>
    feedback.title.toLowerCase().includes(search.toLowerCase()) ||
    feedback.description.toLowerCase().includes(search.toLowerCase()) || 
    feedback.location.toLowerCase().includes(search.toLowerCase()) ||
    feedback.author.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phản ánh hiển thị trên trang hiện tại
  const indexOfLastItem = currentFeedbackPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFeedbackItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // Hàm xử lý khi người dùng chuyển trang
  const handleFeedbackPageChange = (page: number) => {
    setCurrentFeedbackPage(page)
    // Cuộn lên đầu danh sách khi chuyển trang
    window.scrollTo({ top: document.getElementById("feedback-list")?.offsetTop || 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Form phản ánh */}
      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>
          <DialogHeader>
            <div className="text-3xl font-bold text-center p-4">
              Phản ánh tình trạng giao thông
            </div>
            <div className="text-center text-gray-800">
              Gửi thông tin phản ánh về tình trạng giao thông để giúp chúng tôi cải thiện hệ thống giám sát
            </div>
          </DialogHeader>
          <div className="flex w-full my-4 items-center justify-center">
            <div className="px-4">
                <ReportForm/>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 m-6">
        <Button className="bg-black hover:bg-gray-800 rounded-full" onClick={() => setShowFeedbackForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Gửi phản ánh mới
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 " />
          <Input 
            placeholder="Tìm kiếm phản ánh..." 
            className="bg-white border-gray-200 pl-10 text-black rounded-full" 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentFeedbackPage(1); // Reset về trang đầu khi tìm kiếm
            }}
          />
        </div>
      </div>
      
      {/* Filter */}
      <div
        className="flex flex-col gap-4 mx-6"
      >
        <div
          className="flex flex-wrap gap-4"
        >
          <div className="w-1/5">
            <Label htmlFor="severity">Mức độ nghiêm trọng</Label>
            <div
               className="mt-2"
            >
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-white border-gray-200 text-black w-full rounded-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo mức độ" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-black">
                  <SelectItem value="allSeverity">Tất cả mức độ</SelectItem>
                  <SelectItem value="slight">Nhẹ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="serious">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="w-1/5">
            <Label htmlFor="issueType">Loại vấn đề</Label>
            <div
              className="mt-2"
            >
              <Select value={issueFilter} onValueChange={setIssueFilter}>
                <SelectTrigger className="bg-white border-gray-200 text-black w-full rounded-full">
                  <Filter className="h-4 w-4 mr-2 " />
                  <SelectValue placeholder="Lọc theo vấn đề" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-black">
                  <SelectItem value="allIssueType">Tất cả vấn đề</SelectItem>
                  <SelectItem value="trafic-jam">Tắc đường</SelectItem>
                  <SelectItem value="accident">Tai nạn giao thông</SelectItem>
                  <SelectItem value="construction">Công trình đang thi công</SelectItem>
                  <SelectItem value="bad-road">Hư hỏng đường</SelectItem>
                  <SelectItem value="bad-traffic-light">Hư hỏng đèn giao thông</SelectItem>
                  <SelectItem value="flood">Ngập nước</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-1/5">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                className="w-full bg-white border-gray-200 text-black rounded-full"
                defaultValue={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-1/5">
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                className="w-full bg-white border-gray-200 text-black rounded-full"
                defaultValue={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="relative flex-1">
            <Button className="w-full absolute bottom-0 left-0 bg-black rounded-full hover:bg-gray-800 mt-2">
              Lọc phản ánh
            </Button>
          </div>
        </div>
      </div>
      <br />
      <hr className="border-gray-300"/>

      {/* Feedback List */}
      <div className="space-y-6 p-6 pt-9">
        {currentFeedbackItems.map((item) => (
          <Card className="bg-white border-gray-200 overflow-hidden rounded-xl shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative h-[200px] md:h-auto">
                <Image
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-4 md:col-span-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge
                    className={`${
                      item.status === "Đã xử lý"
                        ? "bg-green-600"
                        : item.status === "Đang xử lý"
                          ? "bg-amber-600"
                          : "bg-red-600"
                    } rounded-full`}
                  >
                    {item.status}
                  </Badge>
                  <Badge className="bg-blue-600 rounded-full">{item.type}</Badge>
                  <Badge
                    className={`${
                      item.severity === "Nghiêm trọng"
                        ? "text-white bg-red-500"
                        : item.severity === "Trung bình"
                          ? "text-white bg-amber-500"
                          : "text-white bg-green-500"
                    } rounded-full`}
                  >
                    {item.severity}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-2">{item.title}</h3>

                <div className="flex items-center gap-2 text-sm text-gray-800 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-800 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.time}</span>
                  </div>
                </div>

                <p className="text-gray-900 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-800">Người gửi: {item.author}</div>
                  <Button variant="outline" className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white rounded-full">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {
        totalPages > 1 && (
          <PaginationDemo totalItems={filteredFeedbacks.length} 
            itemsPerPage={itemsPerPage}
            currentPage={currentFeedbackPage}
            onPageChange={handleFeedbackPageChange} 
            className="m-4" 
          />
        )
      }
    </>
  );
};
