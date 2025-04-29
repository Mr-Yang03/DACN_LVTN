'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Edit, 
  Copy, 
  Trash, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Search,
  X
} from 'lucide-react';
import { isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DateRangePicker } from '@/components/ui/date-range-picker';

// Dữ liệu mẫu cho bảng tin tức
const newsData = [
  {
    id: 1,
    title: 'Khai trương tuyến đường vành đai 3 trên cao, giảm tải áp lực giao thông nội đô',
    category: 'traffic',
    categoryName: 'Tình hình giao thông',
    author: 'Nguyễn Văn A',
    publishDate: '26/03/2024',
    status: 'published',
    featured: true,
    content: '<p>Hôm nay, tuyến đường vành đai 3 trên cao đã chính thức được khai trương và đưa vào sử dụng. Dự án có tổng chiều dài 30km, kết nối các quận trung tâm với các khu vực ngoại thành.</p><p>Tuyến đường mới được kỳ vọng sẽ giảm tải áp lực giao thông nội đô, giảm thời gian di chuyển của người dân và giúp giảm ùn tắc giao thông trong giờ cao điểm.</p>'
  },
  {
    id: 2,
    title: 'Tạm ngừng lưu thông tại đường Lê Duẩn để phục vụ Lễ hội',
    category: 'regulation',
    categoryName: 'Quy định mới',
    author: 'Trần Thị B',
    publishDate: '25/03/2024',
    status: 'published',
    featured: false,
    content: '<p>UBND quận 1 thông báo tạm cấm các phương tiện lưu thông qua đường Lê Duẩn trong 3 ngày 26-28/04/2025 để phục vụ tổ chức Lễ hội mùa xuân.</p><p>Các phương tiện sẽ được điều hướng đi theo các tuyến đường Nguyễn Thị Minh Khai, Nam Kỳ Khởi Nghĩa và Nguyễn Du.</p><p>Đề nghị người dân lưu ý và lên kế hoạch di chuyển phù hợp.</p>'
  },
  {
    id: 3,
    title: 'Khởi công dự án mở rộng Quốc lộ 1A đoạn qua địa bàn huyện Thường Tín',
    category: 'construction',
    categoryName: 'Công trình',
    author: 'Lê Văn C',
    publishDate: '24/03/2024',
    status: 'published',
    featured: false,
    content: '<p>Sáng nay, dự án mở rộng Quốc lộ 1A đoạn qua địa bàn huyện Thường Tín đã chính thức được khởi công. Dự án có tổng kinh phí 1.200 tỷ đồng, dự kiến hoàn thành sau 18 tháng thi công.</p><p>Sau khi hoàn thành, tuyến đường sẽ được mở rộng từ 4 làn xe lên 6 làn xe, giúp tăng lưu lượng giao thông và giảm nguy cơ ùn tắc, tai nạn.</p>'
  },
  {
    id: 4,
    title: 'Cảnh báo mưa lớn gây ngập úng nhiều tuyến đường nội thành',
    category: 'weather',
    categoryName: 'Thời tiết',
    author: 'Phạm Thị D',
    publishDate: '23/03/2024',
    status: 'processing',
    featured: false,
    content: '<p>Trung tâm Khí tượng Thủy văn cảnh báo từ chiều nay đến hết ngày mai, khu vực nội thành sẽ có mưa vừa đến mưa to, có nơi mưa rất to với lượng mưa phổ biến từ 40-70mm, có nơi trên 100mm.</p><p>Người dân cần đặc biệt lưu ý các khu vực thường xuyên ngập úng như Nguyễn Hữu Cảnh, Kinh Dương Vương, An Dương Vương. Đề nghị người dân không đi vào các khu vực ngập sâu và tuân thủ hướng dẫn của lực lượng chức năng.</p>'
  },
  {
    id: 5,
    title: 'Tình hình giao thông dịp lễ 30/4 - 1/5: Dự báo tăng 40% lưu lượng',
    category: 'traffic',
    categoryName: 'Tình hình giao thông',
    author: 'Nguyễn Văn A',
    publishDate: '22/03/2024',
    status: 'processing',
    featured: false,
    content: '<p>Sở Giao thông Vận tải dự báo lưu lượng phương tiện trong dịp nghỉ lễ 30/4 - 1/5 sắp tới sẽ tăng khoảng 40% so với ngày thường, đặc biệt tại các cửa ngõ ra vào thành phố và các tuyến đường hướng về khu vực du lịch.</p><p>Để giảm ùn tắc, Sở GTVT sẽ tăng cường phân luồng giao thông, bố trí thêm nhân sự và phương tiện hỗ trợ tại các điểm nóng. Người dân nên lên kế hoạch di chuyển sớm và theo dõi thông tin giao thông trước chuyến đi.</p>'
  },
];

export function NewsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState(newsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    toast({
      title: 'Đã xóa bài viết',
      description: 'Bài viết đã được xóa thành công',
    });
    setDeleteId(null);
  };

  const handleDuplicate = (id: number) => {
    const itemToDuplicate = data.find((item) => item.id === id);
    if (itemToDuplicate) {
      const newItem = {
        ...itemToDuplicate,
        id: Math.max(...data.map((item) => item.id)) + 1,
        title: `${itemToDuplicate.title} (bản sao)`,
        status: 'draft',
      };
      setData([...data, newItem]);
      toast({
        title: 'Đã nhân bản bài viết',
        description: 'Bài viết đã được nhân bản thành công',
      });
    }
  };

  const handleToggleStatus = (id: number) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: item.status === 'published' ? 'draft' : 'published' } : item,
      ),
    );
    toast({
      title: 'Đã cập nhật trạng thái',
      description: 'Trạng thái bài viết đã được cập nhật thành công',
    });
  };

  const handleToggleFeatured = (id: number) => {
    setData(data.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)));
    toast({
      title: 'Đã cập nhật trạng thái nổi bật',
      description: 'Trạng thái nổi bật của bài viết đã được cập nhật thành công',
    });
  };

  // Parse date string to Date object
  const parsePublishDate = (dateString: string) => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // month is 0-based in JS Date
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  };

  // Filter based on search term and date range
  const filteredData = data.filter((item) => {
    // Text search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange?.from) {
      const publishDate = parsePublishDate(item.publishDate);
      if (publishDate) {
        if (dateRange.to) {
          // If we have a complete range, check if the date is within the range
          matchesDateRange = isWithinInterval(publishDate, { 
            start: dateRange.from, 
            end: dateRange.to 
          });
        } else {
          // If we only have a start date, check if the date is after or equal to it
          matchesDateRange = publishDate >= dateRange.from;
        }
      }
    }
    
    return matchesSearch && matchesDateRange;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    let valueA, valueB;

    switch (sortColumn) {
      case 'title':
        valueA = a.title;
        valueB = b.title;
        break;
      case 'category':
        valueA = a.categoryName;
        valueB = b.categoryName;
        break;
      case 'author':
        valueA = a.author;
        valueB = b.author;
        break;
      case 'publishDate':
        valueA = a.publishDate;
        valueB = b.publishDate;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'featured':
        valueA = a.featured ? 1 : 0;
        valueB = b.featured ? 1 : 0;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accident':
        return 'bg-red-500 hover:bg-red-600';
      case 'regulation':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'construction':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'weather':
        return 'bg-cyan-500 hover:bg-cyan-600';
      case 'traffic':
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <div className="w-full sm:w-auto flex-1 md:flex-none order-2 sm:order-1">
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="flex-grow"
            />
          </div>
          
          {dateRange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange(undefined)}
              className="h-10 order-3 sm:order-2"
            >
              <X className="mr-2 h-4 w-4" />
              Xóa bộ lọc ngày
            </Button>
          )}
          
          <div className="relative w-full sm:w-64 order-1 sm:order-3 sm:ml-auto mb-2 sm:mb-0 flex flex-row items-center justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 rounded-full"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px] text-black">
                <Button variant="ghost" onClick={() => handleSort('title')} className="flex items-center justify-center w-full">
                  Tiêu đề
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-black text-center">
                <Button variant="ghost" onClick={() => handleSort('category')}>
                  Danh mục
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-black text-center">
                <Button variant="ghost" onClick={() => handleSort('author')}>
                  Tác giả
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-black text-center">
                <Button variant="ghost" onClick={() => handleSort('publishDate')}>
                  Ngày đăng
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-black text-center">
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Trạng thái
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-black text-center">
                <Button variant="ghost" onClick={() => handleSort('featured')}>
                  Nổi bật
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center text-black">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không tìm thấy bài viết nào
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium">{news.title}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(news.category)}>{news.categoryName}</Badge>
                  </TableCell>
                  <TableCell className='text-center'>{news.author}</TableCell>
                  <TableCell className='text-center'>{news.publishDate}</TableCell>
                  <TableCell className='text-center'>
                    {news.status === 'published' ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Đã đăng
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Bản nháp
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    {news.featured ? (
                      <Badge className="bg-blue-500 hover:bg-blue-600">Nổi bật</Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
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
                        <DropdownMenuItem onClick={() => router.push(`/news/${news.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${news.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(news.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Nhân bản
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatus(news.id)}>
                          {news.status === 'published' ? (
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
                        <DropdownMenuItem onClick={() => handleToggleFeatured(news.id)}>
                          {news.featured ? (
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
                        <AlertDialog open={deleteId === news.id} onOpenChange={(isOpen: boolean) => !isOpen && setDeleteId(null)}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                setDeleteId(news.id);
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
                                onClick={() => handleDelete(news.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}