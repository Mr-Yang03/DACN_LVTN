"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge"
import { ContentSpinner } from "@/components/ui/spinner"
import { 
    MoreHorizontal, 
    ArrowUpDown, 
    Edit, 
    Trash, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Search,
    X,
    Loader2,
    Star,
    Filter
} from 'lucide-react';
import { FeedbackArticle } from '@/apis/feedbackApi';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';
import {
  PaginationDemo
} from "@/components/sections/pagination-demo"

export default function FeedbackTable() {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isLoading, setIsLoading] = useState(false);
    // const [data, setData] = useState<FeedbackArticle[]>([]);
    const [currentDate, setCurrentDate] = useState("");
    const [severityFilter, setSeverityFilter] = useState("allSeverity")
    const [issueFilter, setIssueFilter] = useState("allIssueType")
    const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1)
    const [search, setSearch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const itemsPerPage = 5 // Số lượng phản ánh hiển thị trên mỗi trang

    const data = [
        {
            _id: "1",
            location: "Ngã tư Hàng Xanh",
            date: "24/03/2025",
            time: "07:45",
            issueType: "Tắc đường",
            severity: "serious",
            description: "Tình trạng ùn tắc kéo dài hơn 1km, thời gian di chuyển qua ngã tư mất khoảng 30 phút.",
            status: "Đang xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Ùn tắc 1"],
            author: "Nguyễn Văn A",
        },
        {
            _id: "2",
            location: "Quận 3, TP.HCM",
            date: "23/03/2025",
            time: "16:30",
            issueType: "Hư hỏng đèn giao thông",
            severity: "medium",
            description:
                "Đèn tín hiệu giao thông bị hỏng hoàn toàn, không có cảnh sát giao thông điều tiết, gây nguy hiểm cho người tham gia giao thông.",
            status: "Đã xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Đèn tín hiệu"],
            author: "Trần Thị B",
        },
        {
            _id: "3",
            location: "Đường Nguyễn Hữu Cảnh",
            date: "22/03/2025",
            time: "10:15",
            issueType: "Hư hỏng đường",
            severity: "serious",
            description:
                "Xuất hiện ổ gà lớn trên đường, đường kính khoảng 1m, sâu 30cm, đã gây ra nhiều vụ tai nạn cho xe máy.",
            status: "Đang xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Hư hỏng đường"],
            author: "Lê Văn C",
        },
        {
            _id: "4",
            location: "Đường Lê Văn Sỹ",
            date: "21/03/2025",
            time: "14:20",
            issueType: "Khác",
            severity: "slight",
            description: "Nhiều xe tải đỗ dọc theo đường Lê Văn Sỹ gây cản trở giao thông, làm thu hẹp lòng đường.",
            status: "Đã xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Đỗ xe trái phép"],
            author: "Phạm Thị D",
        },
        {
            _id: "5",
            location: "Quận 1, TP.HCM",
            date: "20/03/2025",
            time: "08:30",
            issueType: "Tai nạn giao thông",
            severity: "medium",
            description: "Tai nạn giữa xe máy và ô tô, có người bị thương nhẹ, gây ùn tắc cục bộ trong khoảng 30 phút.",
            status: "Đã xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Tai nạn"],
            author: "Hoàng Văn E",
        },
        {
            _id: "6",
            location: "Đường Nguyễn Hữu Cảnh",
            date: "19/03/2025",
            time: "17:00",
            issueType: "Ngập nước",
            severity: "serious",
            description:
                "Đường ngập sâu khoảng 50cm sau cơn mưa lớn, nhiều phương tiện không thể di chuyển, gây ùn tắc kéo dài.",
            status: "Đã xử lý",
            images: ["/placeholder.svg?height=200&width=300&text=Ngập nước"],
            author: "Vũ Thị F",
        },
    ]
    
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const parsePublishDateTime = (dateString?: string, timeString?: string) => {
        if (!dateString) return null;
        
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // month is 0-based in JS Date
        const year = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        
        // If there's a time, add it to the date
        if (timeString) {
            const timeParts = timeString.split(':');
            if (timeParts.length === 2) {
                date.setHours(parseInt(timeParts[0], 10));
                date.setMinutes(parseInt(timeParts[1], 10));
            }
        }
        
        return date;
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'serious':
                return 'bg-red-500 hover:bg-red-600';
            case 'medium':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'slight':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    // Filter based on search term and date range
    const filteredData = data.filter((item) => {
        // Text search filter
        const matchesSearch = 
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.author?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.description.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()); // Thêm tìm kiếm theo ID
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange?.from) {
            const publishDateTime = parsePublishDateTime(item.date, item.time);
            if (publishDateTime) {
            if (dateRange.to) {
                // If we have a complete range, check if the date is within the range
                matchesDateRange = isWithinInterval(publishDateTime, { 
                    start: dateRange.from, 
                    end: dateRange.to 
                });
            } else {
                // If we only have a start date, check if the date is after or equal to it
                matchesDateRange = publishDateTime >= dateRange.from;
            }
            }
        }
        
        // Status filter
        const matchesStatus = statusFilter === null || item.status === statusFilter;
        
        return matchesSearch && matchesDateRange && matchesStatus;
    });

    // Sort data based on current sort settings
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;

        let valueA, valueB;

        switch (sortColumn) {
            case 'id':
                valueA = a._id || '';
                valueB = b._id || '';
                break;
            case 'location':
                valueA = a.location || '';
                valueB = b.location || '';
                break;
            case 'issueType':
                valueA = a.issueType || '';
                valueB = b.issueType || '';
                break;
            case 'author':
                valueA = a.author || '';
                valueB = b.author || '';
                break;
            case 'publishDate':
                // Use our new parsePublishDateTime function for more accurate sorting
                valueA = parsePublishDateTime(a.date, a.time)?.getTime() || 0;
                valueB = parsePublishDateTime(b.date, b.time)?.getTime() || 0;
                break;
            case 'status':
                valueA = a.status || '';
                valueB = b.status || '';
                break;
            case 'severity':
                valueA = a.severity ? 1 : 0;
                valueB = b.severity ? 1 : 0;
                break;
            default:
                return 0;
        }

        if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Tính toán phản ánh hiển thị trên trang hiện tại
    const indexOfLastItem = currentFeedbackPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentFeedbackItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Hàm xử lý khi người dùng chuyển trang
    const handleFeedbackPageChange = (page: number) => {
        setCurrentFeedbackPage(page)
        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({ top: document.getElementById("feedback-list")?.offsetTop || 0, behavior: "smooth" })
    }

    return (
        <>
            {/* Search bar */}
            <div className="flex items-center justify-between mb-4 mx-6">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm phản ánh..."
                        className="w-full bg-white border-gray-200 text-black rounded-full pl-10 pr-4 py-2"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentFeedbackPage(1); // Reset về trang đầu khi tìm kiếm
                        }}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
            <br />

            {/* Feedback list */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('id')}>
                                ID
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-1/5 text-black">
                                <Button variant="ghost" onClick={() => handleSort('title')} className="flex items-center justify-center w-full">
                                Địa điểm
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('category')}>
                                Loại vấn đề
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('author')}>
                                Tác giả
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('publishDate')}>
                                Thời gian đăng
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('status')}>
                                Mức độ nghiêm trọng
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('featured')}>
                                Trạng thái
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-center text-black">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <ContentSpinner />
                                </TableCell>
                            </TableRow>
                        ) : currentFeedbackItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    {searchTerm || dateRange ? 
                                    "Không tìm thấy bài viết nào phù hợp với bộ lọc." : 
                                    "Chưa có bài viết nào."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentFeedbackItems.map((feedback) => (
                                <TableRow key={feedback._id}>
                                    <TableCell className="text-center">{feedback._id}</TableCell>
                                    <TableCell className="font-medium">{feedback.location}</TableCell>
                                    <TableCell className="text-center">{feedback.issueType}</TableCell>
                                    <TableCell className='text-center'>{feedback.author}</TableCell>
                                    <TableCell className='text-center'>
                                        {feedback.time} {feedback.date && `- ${feedback.date}`}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getSeverityColor(feedback.severity || 'default')}>{feedback.severity == "serious" ? "Nghiêm trọng" : (feedback.severity == "medium" ? "Trung bình" : "Nhẹ")}</Badge>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        {feedback.status === 'published' ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200"
                                            >
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Đã duyệt
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-amber-50 text-amber-700 border-amber-200"
                                            >
                                                <XCircle className="mr-1 h-3 w-3" />
                                                Đang chờ duyệt
                                            </Badge>
                                        )}
                                    </TableCell>
                                    {/* 
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Mở menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${news._id}`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Xem và chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => feedback._id && handleToggleStatus(news._id)}>
                                                    {feedback.status === 'published' ? (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Chuyển sang nháp
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Đăng bài
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => feedback._id && handleToggleFeatured(news._id)}>
                                                    {feedback.featured ? (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Bỏ nổi bật
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Đánh dấu nổi bật
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog open={deleteId === news._id} onOpenChange={(isOpen: boolean) => !isOpen && setDeleteId(null)}>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.preventDefault();
                                                                // Kiểm tra news._id tồn tại trước khi set state
                                                                if (feedback._id) {
                                                                setDeleteId(feedback._id);
                                                                }
                                                            }}
                                                            >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                                onClick={() => feedback._id && handleDelete(feedback._id)}
                                                            >
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <PaginationDemo totalItems={sortedData.length} 
                    itemsPerPage={itemsPerPage}
                    currentPage={currentFeedbackPage}
                    onPageChange={handleFeedbackPageChange} 
                    className="m-4" 
                    />
                )
            }
        </>
    );
}