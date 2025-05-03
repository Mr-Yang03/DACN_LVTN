'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Play, Pause, SkipBack, Maximize2, Volume2, Camera, Activity, AlertTriangle, Car, Clock, TrendingUp, BarChart3, MapPin } from 'lucide-react'
import type { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function TrafficMonitoringDashboard() {
  const [selectedCamera, setSelectedCamera] = useState({
    id: 1,
    name: 'Ngã tư Phố Huế - Tuệ Tĩnh',
    status: 'online'
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('5:00')
  const [activeTab, setActiveTab] = useState('thongke')

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Thêm hiệu ứng đồng hồ thời gian thực
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentDateTime.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const formattedDate = currentDateTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  // Cập nhật dữ liệu biểu đồ với hiệu ứng gradient
  const vehicleOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter',
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 4,
        opacity: 0.1
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 1,
      position: 'back'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#2563eb'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: ['09:30 AM', '09:45 AM', '09:59 AM', '10:19 AM', '10:34 AM'],
      labels: {
        style: {
          colors: '#718096',
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 4,
      labels: {
        style: {
          colors: '#718096',
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        },
        formatter: function(value) {
          return value.toFixed(0)
        }
      }
    },
    colors: ['#3b82f6'],
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      x: {
        show: true,
        format: 'HH:mm'
      },
      y: {
        formatter: function(value) {
          return value + ' xe'
        }
      },
      marker: {
        show: true
      }
    },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  }

  // Biểu đồ tốc độ với màu và hiệu ứng khác
  const speedOptions: ApexOptions = {
    ...vehicleOptions,
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#10b981'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    colors: ['#059669'],
    tooltip: {
      ...vehicleOptions.tooltip,
      y: {
        formatter: function(value) {
          return value + ' km/h'
        }
      }
    },
    markers: {
      ...vehicleOptions.markers,
      colors: ['#059669']
    }
  }

  // Cập nhật dữ liệu động
  const vehicleSeries = [
    {
      name: 'Số lượng phương tiện',
      data: [20, 45, 30, 50, 35]
    }
  ]

  const speedSeries = [
    {
      name: 'Tốc độ trung bình',
      data: [30, 45, 25, 35, 20]
    }
  ]

  // Dữ liệu phân tích
  const analyticsData = {
    totalVehicles: 96,
    avgSpeed: 51,
    congestionLevel: 'Đông đúc',
    incidents: 0,
    congestionPercent: 37
  }

  // Danh sách camera có thể chọn
  const cameras = [
    { id: 1, name: 'Ngã tư Phố Huế - Tuệ Tĩnh', status: 'online' },
    { id: 2, name: 'Ngã tư Lê Duẩn - Hai Bà Trưng', status: 'online' },
    { id: 3, name: 'Đại lộ Thăng Long', status: 'online' },
    { id: 4, name: 'Cầu Thanh Trì', status: 'offline' }
  ]

  // Hàm chọn camera
  const handleCameraSelect = (camera: typeof cameras[0]) => {
    setSelectedCamera(camera);
  }

  return (
    <div className="flex flex-col gap-6 mx-auto px-4 py-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg shadow-sm">
      {/* Header với title và thời gian */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Giám sát giao thông</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Theo dõi và phân tích tình hình giao thông trực tiếp</p>
        </div>
        <div className="flex flex-col items-end mt-2 md:mt-0 space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-xl font-semibold text-slate-700 dark:text-slate-200">{formattedTime}</span>
          </div>
          <span className="text-xs text-slate-500 capitalize">{formattedDate}</span>
        </div>
      </div>

      {/* Camera và Dữ liệu phân tích */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center px-6 py-10">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Camera className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-white font-medium mb-3">{selectedCamera.name}</p>
                  <p className="text-sm text-slate-400">Đang tải dữ liệu video...</p>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className={`w-2 h-2 rounded-full ${selectedCamera.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-xs font-medium text-white capitalize">{selectedCamera.status === 'online' ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
              </div>
              
              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 text-white p-3 flex items-center gap-3">
                <button onClick={handlePlayPause} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <SkipBack size={16} />
                </button>
                <span className="text-xs font-medium">{currentTime} / {duration}</span>
                <div className="h-1 bg-white/20 flex-1 mx-2 rounded-full overflow-hidden group cursor-pointer">
                  <div className="bg-blue-500 h-1 w-1/3 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Volume2 size={16} />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  {selectedCamera.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-1">
                {cameras.map(camera => (
                  <button
                    key={camera.id}
                    onClick={() => handleCameraSelect(camera)}
                    className={`
                      text-xs px-3 py-1.5 rounded-full font-medium transition-all
                      ${selectedCamera.id === camera.id 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-500/50' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                      ${camera.status === 'offline' ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {camera.name}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dữ liệu phân tích */}
        <div>
          <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Dữ liệu phân tích</span>
                </CardTitle>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">Cập nhật: {formattedTime}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="tongquan" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <TabsTrigger 
                    value="tongquan" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
                  >
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phuongtien"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
                  >
                    Phương tiện
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phantich"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
                  >
                    Phân tích
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tongquan">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-blue-900/40">
                          <Car className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analyticsData.totalVehicles}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Tổng phương tiện</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-emerald-900/40">
                          <TrendingUp className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{analyticsData.avgSpeed} km/h</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Tốc độ trung bình</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-amber-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-amber-900/40">
                          <BarChart3 className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div className="text-sm font-bold bg-amber-500 text-white px-2 rounded-full py-1 inline-block">Đông đúc</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Mức độ ùn tắc</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-red-50 to-white dark:from-slate-800 dark:to-slate-800/70">
                      <CardContent className="pt-4 text-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-red-900/40">
                          <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300" />
                        </div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{analyticsData.incidents}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Sự cố phát hiện</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-5 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mức độ ùn tắc</h3>
                      <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/30 dark:text-amber-300">{analyticsData.congestionPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                      <div 
                        className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${analyticsData.congestionPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Thông thoáng</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Kẹt xe</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="phuongtien" className="animate-in fade-in-50 duration-300">
                  <div className="space-y-4 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Phân loại phương tiện</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">Tổng: {analyticsData.totalVehicles}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">Xe máy</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">69 <span className="text-slate-500 font-normal">(72%)</span></span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">Ô tô</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">21 <span className="text-slate-500 font-normal">(22%)</span></span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">Xe tải</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '5%' }}></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">5 <span className="text-slate-500 font-normal">(5%)</span></span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-20 text-slate-700 dark:text-slate-300">Xe buýt</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '1%' }}></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">1 <span className="text-slate-500 font-normal">(1%)</span></span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="phantich" className="animate-in fade-in-50 duration-300">
                  <div className="space-y-4 p-3 bg-white rounded-lg shadow-sm dark:bg-slate-800">
                    <div className="text-center py-6 space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/40">
                        <Activity className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                      </div>
                      <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Phân tích nâng cao</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Dữ liệu phân tích chi tiết đang được xử lý</p>
                      
                      <div className="w-full max-w-xs mx-auto mt-4">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                          <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3"></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">67% hoàn thành</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Thống kê giao thông */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span>Thống kê giao thông</span>
            </CardTitle>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
              <MapPin className="h-3 w-3 inline mr-0.5" /> {selectedCamera.name}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="thongke" className="w-full">
            <TabsList className="mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="thongke" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
              >
                Thống kê
              </TabsTrigger>
              <TabsTrigger 
                value="bando"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
              >
                Bản đồ
              </TabsTrigger>
              <TabsTrigger 
                value="canhbao"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300"
              >
                Cảnh báo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="thongke" className="animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Car className="h-3.5 w-3.5 text-blue-600" />
                      Số lượng phương tiện
                    </h3>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">30 phút qua</span>
                  </div>
                  <div className="h-[250px]">
                    <ReactApexChart 
                      options={vehicleOptions} 
                      series={vehicleSeries} 
                      type="line" 
                      height={250} 
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      Tốc độ trung bình (km/h)
                    </h3>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-300">30 phút qua</span>
                  </div>
                  <div className="h-[250px]">
                    <ReactApexChart 
                      options={speedOptions} 
                      series={speedSeries} 
                      type="line" 
                      height={250} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bando" className="animate-in fade-in-50 duration-300">
              <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg shadow-sm text-center p-6 dark:bg-slate-800">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/40">
                    <MapPin className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1 dark:text-slate-200">Bản đồ khu vực</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dữ liệu bản đồ đang được tải...</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="canhbao" className="animate-in fade-in-50 duration-300">
              <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg shadow-sm text-center p-6 dark:bg-slate-800">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900/40">
                    <AlertTriangle className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1 dark:text-slate-200">Không có cảnh báo</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hiện tại khu vực này không có cảnh báo nào</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}