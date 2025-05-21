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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';
import {
  PaginationDemo
} from "@/components/sections/pagination-demo"
import { useToast } from '@/hooks/use-toast';
import { getFeedbackList } from "@/apis/feedbackApi";
import { useRouter } from 'next/navigation';

export default function FeedbackTable() {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [severityFilter, setSeverityFilter] = useState("Tất cả mức độ")
    const [issueFilter, setIssueFilter] = useState("Tất cả vấn đề")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1)
    const [search, setSearch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const itemsPerPage = 5 // Số lượng phản ánh hiển thị trên mỗi trang

    // Load data on component mount
    useEffect(() => {
        // Fetch news data from API
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const feedbackData = await getFeedbackList();
                setData(feedbackData);
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
            case 'Nghiêm trọng':
                return 'bg-red-500 hover:bg-red-600';
            case 'Trung bình':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Nhẹ':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    console.log(data)

    const searchedFeedbacks = data.filter(feedback =>
        feedback.title.toLowerCase().includes(search.toLowerCase()) ||
        feedback.description.toLowerCase().includes(search.toLowerCase()) || 
        feedback.location.toLowerCase().includes(search.toLowerCase()) ||
        feedback.author.toLowerCase().includes(search.toLowerCase()) ||
        feedback.author_username.toLowerCase().includes(search.toLowerCase())
    );

    const filteredFeedbacks = searchedFeedbacks.filter((feedback) => {
        const matchSeverity = severityFilter === "Tất cả mức độ" || feedback.severity === severityFilter;

        const matchIssue = issueFilter === "Tất cả vấn đề" || feedback.type === issueFilter;

        let matchDate = true;
        if (startDate || endDate) {
            const rawDate = feedback.date || "";  // vd: "14-05-2025" hoặc "14/05/2025"
            const rawTime = feedback.time || "00:00";

            // Normalize date string (dd-mm-yyyy or dd/mm/yyyy -> yyyy-mm-dd)
            const normalizedDateStr = rawDate.replace(/\//g, "-");
            const [day, month, year] = normalizedDateStr.split("-");
            const itemDatetime = new Date(`${year}-${month}-${day}T${rawTime}`);

            if (startDate && itemDatetime < new Date(startDate)) matchDate = false;
            if (endDate && itemDatetime > new Date(endDate)) matchDate = false;
        }

        return matchSeverity && matchIssue && matchDate;
    });

    // Sort data based on current sort settings
    const sortedData = [...filteredFeedbacks].sort((a, b) => {
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
            case 'type':
                valueA = a.type || '';
                valueB = b.type || '';
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
            case 'severity':
                const severityValues = { "Nghiêm trọng": 3, "Trung bình": 2, "Nhẹ": 1 };
                valueA = severityValues[a.severity as keyof typeof severityValues] || 0;
                valueB = severityValues[b.severity as keyof typeof severityValues] || 0;
                break;
            case 'status':
                valueA = a.status || '';
                valueB = b.status || '';
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
                    className="flex flex-row flex-wrap gap-4 justify-between"
                >
                    <div className="flex-1">
                        <Label htmlFor="severity" className="truncate max-w-[120px] md:max-w-none">Mức độ nghiêm trọng</Label>
                        <div
                            className="mt-2"
                        >
                            <Select value={severityFilter} defaultValue="Tất cả mức độ" onValueChange={setSeverityFilter}>
                                <SelectTrigger className="bg-white border-gray-200 text-black w-full rounded-full">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Lọc theo mức độ" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 text-black">
                                    <SelectItem value="Tất cả mức độ">Tất cả mức độ</SelectItem>
                                    <SelectItem value="Nhẹ">Nhẹ</SelectItem>
                                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                                    <SelectItem value="Nghiêm trọng">Nghiêm trọng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <Label htmlFor="issueType">Loại vấn đề</Label>
                        <div
                            className="mt-2"
                        >
                            <Select value={issueFilter} defaultValue="Tất cả vấn đề" onValueChange={setIssueFilter}>
                                <SelectTrigger className="bg-white border-gray-200 text-black w-full rounded-full">
                                    <Filter className="h-4 w-4 mr-2 " />
                                    <SelectValue placeholder="Lọc theo vấn đề" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 text-black">
                                    <SelectItem value="Tất cả vấn đề">Tất cả vấn đề</SelectItem>
                                    <SelectItem value="Tắc đường">Tắc đường</SelectItem>
                                    <SelectItem value="Tai nạn giao thông">Tai nạn giao thông</SelectItem>
                                    <SelectItem value="Công trình đang thi công">Công trình đang thi công</SelectItem>
                                    <SelectItem value="Hư hỏng đường">Hư hỏng đường</SelectItem>
                                    <SelectItem value="Đèn tín hiệu hỏng">Đèn tín hiệu hỏng</SelectItem>
                                    <SelectItem value="Ngập nước">Ngập nước</SelectItem>
                                    <SelectItem value="Khác">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Ngày bắt đầu</Label>
                            <Input
                                id="startDate"
                                type="date"
                                className="w-full bg-white border-gray-200 text-black rounded-full"
                                defaultValue=""
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Ngày kết thúc</Label>
                            <Input
                                id="endDate"
                                type="date"
                                className="w-full bg-white border-gray-200 text-black rounded-full"
                                defaultValue=""
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

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
                                <Button variant="ghost" onClick={() => handleSort('location')} className="flex items-center justify-center w-full">
                                Địa điểm
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('type')}>
                                Loại vấn đề
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-black text-center w-1/10">
                                <Button variant="ghost" onClick={() => handleSort('author')}>
                                Người gửi
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
                                <Button variant="ghost" onClick={() => handleSort('severity')}>
                                Mức độ nghiêm trọng
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
                                    "Không tìm thấy phản ánh nào phù hợp với bộ lọc." : 
                                    "Chưa có phản ánh nào."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentFeedbackItems.map((feedback, index) => (
                                <TableRow key={feedback._id}>
                                    <TableCell className="text-center">{index + 1 + (currentFeedbackPage - 1) * itemsPerPage}</TableCell>
                                    <TableCell className="font-medium">{feedback.location}</TableCell>
                                    <TableCell className="text-center">{feedback.type}</TableCell>
                                    <TableCell className='text-center'>{feedback.author + " - " + feedback.author_username}</TableCell>
                                    <TableCell className='text-center'>
                                        {feedback.time} {feedback.date && `- ${feedback.date}`}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge className={getSeverityColor(feedback.severity || 'default')}>{feedback.severity}</Badge>
                                    </TableCell>
                                    
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
                                                <DropdownMenuItem onClick={() => router.push(`/admin/feedback/view/${feedback._id}`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
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