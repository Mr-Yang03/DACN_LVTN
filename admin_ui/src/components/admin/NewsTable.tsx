'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Star
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
import { getAllNews, deleteNews, updateNews, NewsArticle } from '@/apis/newsApi';
import { ContentSpinner } from '@/components/ui/spinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function NewsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);

  // Load data on component mount
  useEffect(() => {
    // Fetch news data from API
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const newsData = await getAllNews();
        setData(newsData);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      setData(data.filter((item) => item._id !== id));
      toast({
        title: 'Đã xóa bài viết',
        description: 'Bài viết đã được xóa thành công',
      });
    } catch (err) {
      console.error('Failed to delete news:', err);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa bài viết. Vui lòng thử lại sau.',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const item = data.find((item) => item._id === id);
    if (!item) return;
    
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    
    try {
      await updateNews(id, { status: newStatus });
      setData(
        data.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      
      toast({
        title: 'Đã cập nhật trạng thái',
        description: 'Trạng thái bài viết đã được cập nhật thành công',
      });
    } catch (err) {
      console.error('Failed to update news status:', err);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái bài viết. Vui lòng thử lại sau.',
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const item = data.find((item) => item._id === id);
    if (!item) return;
    
    const newFeaturedStatus = !item.featured;
    
    try {
      await updateNews(id, { featured: newFeaturedStatus });
      setData(
        data.map((item) =>
          item._id === id ? { ...item, featured: newFeaturedStatus } : item
        )
      );
      
      toast({
        title: 'Đã cập nhật trạng thái nổi bật',
        description: 'Trạng thái nổi bật của bài viết đã được cập nhật thành công',
      });
    } catch (err) {
      console.error('Failed to update news featured status:', err);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái nổi bật. Vui lòng thử lại sau.',
      });
    }
  };

  // Parse date string to Date object
  const parsePublishDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // month is 0-based in JS Date
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
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

  // Filter based on search term and date range
  const filteredData = data.filter((item) => {
    // Text search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()); // Thêm tìm kiếm theo ID
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange?.from) {
      const publishDateTime = parsePublishDateTime(item.publishDate, item.publishTime);
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
    
    // Featured filter
    const matchesFeatured = featuredFilter === null || 
      (featuredFilter === true && item.featured) || 
      (featuredFilter === false && !item.featured);
    
    return matchesSearch && matchesDateRange && matchesStatus && matchesFeatured;
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
      case 'title':
        valueA = a.title || '';
        valueB = b.title || '';
        break;
      case 'category':
        valueA = a.category || '';
        valueB = b.category || '';
        break;
      case 'author':
        valueA = a.author || '';
        valueB = b.author || '';
        break;
      case 'publishDate':
        // Use our new parsePublishDateTime function for more accurate sorting
        valueA = parsePublishDateTime(a.publishDate, a.publishTime)?.getTime() || 0;
        valueB = parsePublishDateTime(b.publishDate, b.publishTime)?.getTime() || 0;
        break;
      case 'status':
        valueA = a.status || '';
        valueB = b.status || '';
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
      case 'Tai nạn':
        return 'bg-red-500 hover:bg-red-600';
      case 'Quy định':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'Công trình':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Thời tiết':
        return 'bg-cyan-500 hover:bg-cyan-600';
      case 'Giao thông':
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full flex flex-wrap gap-2 mt-2">
          <div className="flex flex-wrap items-center gap-2 grow">
            {/* Date Range Filter */}
            <div className="w-[200px]">
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            
            {/* Status filter */}
            <div className="w-[200px]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-full  text-gray-500",
                      statusFilter && "text-primary border-primary"
                    )}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {statusFilter === 'published' 
                      ? "Đã đăng" 
                      : statusFilter === 'draft' 
                        ? "Bản nháp" 
                        : "Chọn trạng thái"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={statusFilter === 'published' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === 'published' ? null : 'published')}
                      className="justify-start"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Đã đăng
                    </Button>
                    <Button
                      variant={statusFilter === 'draft' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === 'draft' ? null : 'draft')}
                      className="justify-start"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Bản nháp
                    </Button>
                    {statusFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter(null)}
                        className="justify-start text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Featured filter */}
            <div className="w-[200px]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-full  text-gray-600",
                      featuredFilter !== null && "text-primary border-primary"
                    )}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {featuredFilter === true 
                      ? "Nổi bật" 
                      : featuredFilter === false 
                        ? "Không nổi bật" 
                        : "Chọn nổi bật"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={featuredFilter === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeaturedFilter(featuredFilter === true ? null : true)}
                      className="justify-start"
                    >
                      <Star className="mr-2 h-4 w-4 fill-current" />
                      Nổi bật
                    </Button>
                    <Button
                      variant={featuredFilter === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeaturedFilter(featuredFilter === false ? null : false)}
                      className="justify-start"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Không nổi bật
                    </Button>
                    {featuredFilter !== null && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFeaturedFilter(null)}
                        className="justify-start text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Clear all filters button - moved right after featured filter */}
            {(statusFilter !== null || featuredFilter !== null || dateRange || searchTerm) && (
              <div className="h-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter(null);
                    setFeaturedFilter(null);
                    setDateRange(undefined);
                    setSearchTerm('');
                  }}
                  className="h-10 rounded-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            {/* Search input - moved to the right */}
            <div className="w-[300px] relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết theo id, tiêu đề, tác giả"
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
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black text-center w-[60px]">
                <Button variant="ghost" onClick={() => handleSort('id')}>
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
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
                  Thời gian đăng
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
              <TableHead className="w-[200px] text-center text-black ">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <ContentSpinner />
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {searchTerm || dateRange ? 
                    "Không tìm thấy bài viết nào phù hợp với bộ lọc." : 
                    "Chưa có bài viết nào."}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((news) => (
                <TableRow key={news._id}>
                  <TableCell className="text-center">{news._id}</TableCell>
                  <TableCell className="font-medium">{news.title}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getCategoryColor(news.category || 'default')}>{news.category || 'Chung'}</Badge>
                  </TableCell>
                  <TableCell className='text-center'>{news.author}</TableCell>
                  <TableCell className='text-center'>
                    {news.publishTime} {news.publishDate && `- ${news.publishDate}`}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${news._id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Xem và chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => news._id && handleToggleStatus(news._id)}>
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
                        <DropdownMenuItem onClick={() => news._id && handleToggleFeatured(news._id)}>
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
                        <AlertDialog open={deleteId === news._id} onOpenChange={(isOpen: boolean) => !isOpen && setDeleteId(null)}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                // Kiểm tra news._id tồn tại trước khi set state
                                if (news._id) {
                                  setDeleteId(news._id);
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
                                onClick={() => news._id && handleDelete(news._id)}
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