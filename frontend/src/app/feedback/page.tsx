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

export default function ReportPage() {
  const [severityFilter, setSeverityFilter] = useState("allSeverity")
  const [issueFilter, setIssueFilter] = useState("allIssueType")
  const [currentDate, setCurrentDate] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1)
  const [search, setSearch] = useState<string>("");
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]); // Dữ liệu phản ánh giả lập

  const itemsPerPage = 3 // Số lượng phản ánh hiển thị trên mỗi trang

  // const feedbackItems = [
  //     {
  //         id: 1,
  //         title: "Ùn tắc giao thông nghiêm trọng tại ngã tư Hàng Xanh",
  //         location: "Ngã tư Hàng Xanh, Quận Bình Thạnh, TP.HCM",
  //         date: "24/03/2025",
  //         time: "07:45",
  //         type: "Tắc đường",
  //         severity: "Nghiêm trọng",
  //         description: "Tình trạng ùn tắc kéo dài hơn 1km, thời gian di chuyển qua ngã tư mất khoảng 30 phút.",
  //         status: "Đang xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Ùn tắc 1"],
  //         author: "Nguyễn Văn A",
  //     },
  //     {
  //         id: 2,
  //         title: "Đèn tín hiệu giao thông bị hỏng tại đường Điện Biên Phủ",
  //         location: "Giao lộ Điện Biên Phủ - Nguyễn Thiện Thuật, Quận 3, TP.HCM",
  //         date: "23/03/2025",
  //         time: "16:30",
  //         type: "Hư hỏng đèn giao thông",
  //         severity: "Trung bình",
  //         description:
  //             "Đèn tín hiệu giao thông bị hỏng hoàn toàn, không có cảnh sát giao thông điều tiết, gây nguy hiểm cho người tham gia giao thông.",
  //         status: "Đã xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Đèn tín hiệu"],
  //         author: "Trần Thị B",
  //     },
  //     {
  //         id: 3,
  //         title: "Hư hỏng mặt đường nghiêm trọng trên đường Nguyễn Hữu Cảnh",
  //         location: "Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM",
  //         date: "22/03/2025",
  //         time: "10:15",
  //         type: "Hư hỏng đường",
  //         severity: "Nghiêm trọng",
  //         description:
  //             "Xuất hiện ổ gà lớn trên đường, đường kính khoảng 1m, sâu 30cm, đã gây ra nhiều vụ tai nạn cho xe máy.",
  //         status: "Đang xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Hư hỏng đường"],
  //         author: "Lê Văn C",
  //     },
  //     {
  //         id: 4,
  //         title: "Xe tải đỗ trái phép gây cản trở giao thông",
  //         location: "Đường Lê Văn Sỹ, Quận 3, TP.HCM",
  //         date: "21/03/2025",
  //         time: "14:20",
  //         type: "Khác",
  //         severity: "Nhẹ",
  //         description: "Nhiều xe tải đỗ dọc theo đường Lê Văn Sỹ gây cản trở giao thông, làm thu hẹp lòng đường.",
  //         status: "Đã xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Đỗ xe trái phép"],
  //         author: "Phạm Thị D",
  //     },
  //     {
  //         id: 5,
  //         title: "Tai nạn giao thông tại giao lộ Nguyễn Thị Minh Khai - Nam Kỳ Khởi Nghĩa",
  //         location: "Giao lộ Nguyễn Thị Minh Khai - Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM",
  //         date: "20/03/2025",
  //         time: "08:30",
  //         type: "Tai nạn giao thông",
  //         severity: "Trung bình",
  //         description: "Tai nạn giữa xe máy và ô tô, có người bị thương nhẹ, gây ùn tắc cục bộ trong khoảng 30 phút.",
  //         status: "Đã xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Tai nạn"],
  //         author: "Hoàng Văn E",
  //     },
  //     {
  //         id: 6,
  //         title: "Ngập nước sau mưa lớn tại đường Nguyễn Hữu Cảnh",
  //         location: "Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM",
  //         date: "19/03/2025",
  //         time: "17:00",
  //         type: "Ngập nước",
  //         severity: "Nghiêm trọng",
  //         description:
  //             "Đường ngập sâu khoảng 50cm sau cơn mưa lớn, nhiều phương tiện không thể di chuyển, gây ùn tắc kéo dài.",
  //         status: "Đã xử lý",
  //         images: ["/placeholder.svg?height=200&width=300&text=Ngập nước"],
  //         author: "Vũ Thị F",
  //     },
  // ]

  useEffect(() => {
    const fetchFeedbackList = async () => {
      try {
        const response = await getUserFeedbackList({});
        console.log(response)
        // setFeedbackItems(response);
      } catch (err) {
        console.error("Lỗi khi tải phản hồi:", err);
      }
    };

    fetchFeedbackList();

    const now = new Date();
    setCurrentDate(now.toISOString().split("T")[0]); // YYYY-MM-DD
    setTimeout(() => {}, 500)
  }, []);

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
          <Card key={item.id} className="bg-white border-gray-200 overflow-hidden rounded-xl shadow-md p-4">
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
