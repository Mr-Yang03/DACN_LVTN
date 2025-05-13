import type { Metadata } from "next"
import { TrafficMonitoringDashboard } from "@/components/admin/monitor/TrafficMonitoringDashboard"

export const metadata: Metadata = {
  title: "Giám sát giao thông | Admin Dashboard",
  description: "Giám sát trực tiếp tình hình giao thông qua hệ thống camera",
}

export default function MonitorPage() {
  return <TrafficMonitoringDashboard />
}