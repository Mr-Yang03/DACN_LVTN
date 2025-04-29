'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import GoongMap from "@/components/ui/GoongMap";
import { AlertTriangle, CloudSun, Video, Car, Users, Newspaper, Eye } from 'lucide-react'
import type { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const vehicleChartOptions = {
  chart: {
    type: 'line' as const,
    height: 550,
    toolbar: { show: false },
    fontFamily: 'Inter'
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  xaxis: {
    categories: ['00h', '06h', '12h', '18h', '24h'],
    title: { text: 'Thời gian' , style: { fontSize: '13px' }}
  },
  yaxis: {
    title: { text: 'Phương tiện' , style: { fontSize: '13px' }}
  },
  colors: ['#007bff'],
  tooltip: {
    theme: 'light'
  }
}

const vehicleChartSeries = [
  {
    name: 'Lưu lượng phương tiện',
    data: [120, 300, 450, 600, 200]
  }
]

const reportChartOptions = {
  chart: {
    type: 'bar' as const,
    height: 550,
    toolbar: { show: false },
    fontFamily: 'Inter'
  },
  xaxis: {
    categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
    title: { text: 'Tháng' , style: { fontSize: '13px' } }
  },
  yaxis: {
    title: { text: 'Số lượng' , style: { fontSize: '13px' }}
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'
    }
  },
  colors: ['#dc3545', '#28a745'],
  dataLabels: {
    enabled: false
  },
  legend: {
    position: 'top'
  },
  tooltip: {
    theme: 'light'
  }
}

const reportChartSeries = [
  {
    name: 'Báo cáo',
    data: [5, 12, 9, 8, 10, 15, 7, 6, 11, 9, 14, 13]
  },
  {
    name: 'Tin tức',
    data: [8, 6, 10, 12, 9, 14, 11, 13, 15, 10, 8, 7]
  }
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt truy cập</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">So với tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camera đang hoạt động</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground">3 camera đang bảo trì</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cảnh báo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55</div>
            <p className="text-xs text-muted-foreground">Trong 24h qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời tiết</CardTitle>
            <CloudSun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33°C</div>
            <p className="text-xs text-muted-foreground">TP. HCM</p>
          </CardContent>
        </Card>

        {/* Tổng lượng truy cập tháng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt truy cập tháng</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.234</div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày qua</p>
          </CardContent>
        </Card>

        {/* Tổng lượng người dùng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.298</div>
            <p className="text-xs text-muted-foreground">Tất cả người dùng đã đăng ký</p>
          </CardContent>
        </Card>

        {/* Tổng lượng tin tức */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin tức</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <p className="text-xs text-muted-foreground">Trong 24h qua</p>
          </CardContent>
        </Card>

        {/* Người dùng đang hoạt động */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng đang hoạt động</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">Đang trực tuyến</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 pt-6">
        <h2 className="text-2xl font-semibold mb-4">Hệ thống giám sát giao thông đô thị</h2>
      </div>

      {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
        <div className="bg-white rounded-lg border p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Lưu lượng phương tiện (24h)</h2>
          <ReactApexChart options={vehicleChartOptions} series={vehicleChartSeries} type="line" height={250} />
        </div>

        <div className="bg-white rounded-lg border p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Báo cáo & Tin tức</h2>
          <ReactApexChart options={reportChartOptions} series={reportChartSeries} type="bar" height={250} />
        </div>
      </div> */}

      {/* Biểu đồ thống kê */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
        <div className="bg-white rounded-lg border p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Lưu lượng phương tiện (24h)</h2>
          <ReactApexChart options={vehicleChartOptions as ApexOptions} series={vehicleChartSeries} type="line" height={250} />
        </div>

        <div className="bg-white rounded-lg border p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Báo cáo & Tin tức</h2>
          <ReactApexChart options={reportChartOptions as ApexOptions} series={reportChartSeries} type="bar" height={250} />
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-2xl font-semibold mb-4">Bản đồ giám sát</h2>
        <div className="bg-white rounded-lg border shadow overflow-hidden h-[32rem]">
          <GoongMap />
        </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Camera an ninh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["cam1.jpg", "cam2.jpg", "cam3.jpg"].map((src, idx) => (
            <div key={idx} className="bg-white rounded-lg p-2 border shadow">
              <img
                src={`/camera/${src}`}
                alt={`Camera ${idx + 1}`}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="text-sm text-center mt-2">Camera {idx + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
