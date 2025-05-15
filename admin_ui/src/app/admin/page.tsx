'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { api } from '@/apis/axiosInstance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { AlertCircle, CheckCircle2, Clock, Database } from 'lucide-react';

// Đăng ký các components Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsData {
  total_requests: number;
  services: Record<string, number>;
  status_codes: Record<string, number>;
  top_endpoints: { path: string; count: number }[];
  time_series: { time: string; count: number }[];
  avg_response_time: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/metrics/dashboard');
        if (response.status !== 200) {
          throw new Error('Không thể kết nối với API Gateway');
        }
        const data = response.data;
        setMetrics(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Không thể tải dữ liệu từ API Gateway');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 10000); // Cập nhật mỗi 10 giây

    return () => clearInterval(intervalId);
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu metrics...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">Không thể tải dữ liệu</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Vui lòng kiểm tra kết nối đến API Gateway và thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  // Nếu không có dữ liệu
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <Database className="h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Chưa có dữ liệu</h2>
          <p className="text-muted-foreground">
            Chưa có dữ liệu metrics nào được ghi nhận. Hệ thống sẽ bắt đầu thu thập dữ liệu khi có requests.
          </p>
        </div>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ
  const timeSeriesData = {
    labels: metrics.time_series.map(item => item.time),
    datasets: [
      {
        label: 'Số lượng Requests',
        data: metrics.time_series.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const serviceData = {
    labels: Object.keys(metrics.services).map(service => 
      service.charAt(0).toUpperCase() + service.slice(1)
    ),
    datasets: [
      {
        label: 'Request theo Service',
        data: Object.values(metrics.services),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const statusCodeColors: Record<string, string> = {
    '200': 'rgba(34, 197, 94, 0.8)',   // Xanh lá đậm - OK
    '400': 'rgba(250, 204, 21, 0.8)',  // Vàng đậm - Bad Request
    '401': 'rgba(249, 115, 22, 0.8)',  // Cam đậm - Unauthorized
    '403': 'rgba(249, 115, 22, 0.8)',  // Cam đậm - Forbidden
    '404': 'rgba(249, 115, 22, 0.8)',  // Cam đậm - Not Found
    '500': 'rgba(239, 68, 68, 0.8)',   // Đỏ đậm - Server Error
  };

  const statusCodeBorders: Record<string, string> = {
    '200': 'rgba(34, 197, 94, 1)',
    '400': 'rgba(250, 204, 21, 1)',
    '401': 'rgba(249, 115, 22, 1)',
    '403': 'rgba(249, 115, 22, 1)',
    '404': 'rgba(249, 115, 22, 1)',
    '500': 'rgba(239, 68, 68, 1)',
  };

  const statusCodeLabels: Record<string, string> = {
    '200': 'OK',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '500': 'Server Error',
  };

  const statusData = {
    labels: Object.keys(metrics.status_codes).map(code => `${code} - ${statusCodeLabels[code] || code}`),
    datasets: [
      {
        label: 'Số lượng',
        data: Object.values(metrics.status_codes),
        backgroundColor: Object.keys(metrics.status_codes).map(code => statusCodeColors[code] || 'rgba(99, 102, 241, 0.8)'),
        borderColor: Object.keys(metrics.status_codes).map(code => statusCodeBorders[code] || 'rgba(99, 102, 241, 1)'),
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Tính toán các metrics bổ sung
  const successRate = metrics.status_codes['200'] 
    ? ((metrics.status_codes['200'] / metrics.total_requests) * 100).toFixed(1) 
    : "0";
  
  const errorCount = Object.entries(metrics.status_codes)
    .filter(([code]) => code.startsWith('4') || code.startsWith('5'))
    .reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="container py-8 mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 bg-white dark:bg-slate-950 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gateway Metrics Dashboard</h1>
            <p className="text-muted-foreground">
              Theo dõi hiệu suất và sử dụng API Gateway trong thời gian thực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số Requests</CardTitle>
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.total_requests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng số requests xử lý qua Gateway
                </p>
              </CardContent>
            </Card>
          
            <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Thời gian phản hồi</CardTitle>
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {metrics.avg_response_time.toFixed(3)}s
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Thời gian phản hồi trung bình
                </p>
              </CardContent>
            </Card>
          
            <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tỉ lệ thành công</CardTitle>
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {successRate}%
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                    success
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tỷ lệ request trả về mã 200 OK
                </p>
              </CardContent>
            </Card>
          
            <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng số lỗi</CardTitle>
                <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {errorCount}
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
                    errors
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng số request lỗi (4xx và 5xx)
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              <TabsTrigger value="overview" className="rounded-md text-sm font-medium py-2.5">Tổng quan</TabsTrigger>
              <TabsTrigger value="services" className="rounded-md text-sm font-medium py-2.5">Phân tích Services</TabsTrigger>
              <TabsTrigger value="endpoints" className="rounded-md text-sm font-medium py-2.5">Endpoints phổ biến</TabsTrigger>
            </TabsList>
          
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b">
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Lượng Requests theo thời gian (24 giờ qua)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="h-80">
                    <Line 
                      data={timeSeriesData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                          mode: 'index',
                          intersect: false,
                        },
                        scales: {
                          y: { 
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                              precision: 0,
                            }
                          },
                          x: { 
                            grid: { display: false },
                          }
                        },
                        plugins: { 
                          legend: { position: 'top' },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                            boxPadding: 6,
                            usePointStyle: true,
                          }
                        },
                        elements: {
                          line: {
                            borderWidth: 3,
                          }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-b">
                    <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                      Phân bố theo trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <div className="h-[300px]">
                      <Pie 
                        data={statusData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { 
                            legend: { 
                              position: 'right',
                              labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                  size: 12
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              padding: 12,
                              titleFont: {
                                size: 14,
                              },
                              bodyFont: {
                                size: 13,
                              },
                              boxPadding: 6,
                              usePointStyle: true,
                            }
                          },
                          elements: {
                            arc: {
                              borderWidth: 2
                            }
                          }
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-b">
                    <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                      Phân bố theo Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <div className="h-[300px]">
                      <Pie 
                        data={serviceData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { 
                            legend: { 
                              position: 'right',
                              labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                  size: 12
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              padding: 12,
                              titleFont: {
                                size: 14,
                              },
                              bodyFont: {
                                size: 13,
                              },
                              boxPadding: 6,
                              usePointStyle: true,
                            }
                          },
                          elements: {
                            arc: {
                              borderWidth: 2
                            }
                          }
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          
            <TabsContent value="services" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-b">
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Phân bố lượng Requests theo Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="h-[400px]">
                    <Bar 
                      data={serviceData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { 
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                              precision: 0,
                            }
                          },
                          x: { 
                            grid: { display: false },
                          }
                        },
                        plugins: { 
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                            boxPadding: 6,
                            usePointStyle: true,
                          }
                        },
                        elements: {
                          bar: {
                            borderWidth: 2,
                            borderRadius: 6
                          }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950/40 dark:to-blue-950/40 border-b">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Chi tiết lượng Requests theo Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                          <TableHead className="font-semibold">Service</TableHead>
                          <TableHead className="text-right font-semibold">Số lượng</TableHead>
                          <TableHead className="text-right font-semibold">Tỷ lệ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(metrics.services)
                          .sort(([, a], [, b]) => b - a)
                          .map(([service, count], index) => (
                            <TableRow key={service} className={index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-slate-900/50'}>
                              <TableCell className="font-medium capitalize">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: serviceData.datasets[0].backgroundColor[index % serviceData.datasets[0].backgroundColor.length] }}></div>
                                  {service}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{count.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                                    {((count / metrics.total_requests) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          
            <TabsContent value="endpoints" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/40 dark:to-teal-950/40 border-b">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Top 10 Endpoints được truy cập nhiều nhất
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                          <TableHead className="w-[50px] font-semibold">#</TableHead>
                          <TableHead className="font-semibold">Đường dẫn</TableHead>
                          <TableHead className="text-right font-semibold">Số lượt</TableHead>
                          <TableHead className="text-right font-semibold">Tỷ lệ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.top_endpoints.map((endpoint, index) => (
                          <TableRow key={index} className={index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-slate-900/50'}>
                            <TableCell className="font-medium">
                              <div className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-bold">
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md hover:border-green-300 dark:hover:border-green-700">
                                {endpoint.path}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">{endpoint.count.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                                  {((endpoint.count / metrics.total_requests) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}