"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Clock, AlertTriangle, User, Phone, Mail, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { getFeedback, FeedbackArticle } from "@/apis/feedbackApi"
import React from "react";
import { useToast } from "@/hooks/use-toast";

// This would typically come from your database
const fakeData = {
  _id: "682b35693219a62e1a2c64c7",
  title: "Phản ánh về công trình đang thi công",
  location: "10.880917701353383, 106.80595616676413",
  type: "Công trình đang thi công",
  severity: "Nhẹ",
  description:
    "Công trình thi công gây tiếng ồn lớn vào buổi tối, ảnh hưởng đến sinh hoạt của người dân xung quanh. Đề nghị có biện pháp giảm thiểu tiếng ồn trong khung giờ nghỉ ngơi.",
  images: [
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image1.jpg",
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image2.jpg",
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image3.jpg",
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image4.jpg",
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image5.jpg",
    "https://storage.googleapis.com/bucket_ggmap-456203/feedback_files/2025/image6.jpg",
  ],
  author: "Dương Phúc Thắng",
  author_username: "admintd",
  phone_number: "0912345678",
  email: "abc@gmail.com",
  date: "19-05-2025",
  time: "20:38",
  created_at: "2025-05-19T13:43:05.058+00:00",
  updated_at: "2025-05-19T13:43:05.058+00:00",
}

interface FeedbackDetailPageProps {
    params: Promise<{ id: string }>;
}

// In a real application, you would fetch the data based on the ID
export default async function FeedbackDetailPage( {params}: FeedbackDetailPageProps ) {
    // For demo purposes, we're using the static data
    const feedback = fakeData
    const resolvedParams = await params; // Await params to resolve the Promise
    const id = resolvedParams?.id || 'unknown'; // Fallback for missing id
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast();
    
    const [feedbackData, setFeedbackData] = useState<any>({
        _id: "",
        title: "",
        location: "",
        type: "",
        severity: "",
        description: "",
        images: [],
        author: "",
        author_username: "",
        phone: "",
        email: "",
        date: "",
        time: "",
    })

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await getFeedback(id)
                if (data) setFeedbackData(data)
            } catch (err) {
                setError("Failed to fetch feedback data")
            } finally {
                setLoading(false)
            }
        }

        fetchFeedback()
    }, [id])

    console.log("Feedback Data:", feedbackData)

    // Extract latitude and longitude from the location string
    const [latitude, longitude] = feedbackData.location.split(", ")

    // Create Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

    // Determine severity color
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
        case "Nhẹ":
            return "bg-green-100 text-green-800"
        case "Trung bình":
            return "bg-yellow-100 text-yellow-800"
        case "Nghiêm trọng":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
            <Link href="/admin/feedback" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Quay lại danh sách
            </Link>
            </Button>
        </div>

        <Card className="mb-8">
            <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{feedback.title}</CardTitle>
                <Badge className={getSeverityColor(feedback.severity)}>{feedback.severity}</Badge>
            </div>
            </CardHeader>

            <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Vị trí</p>
                    <Link
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    >
                    {latitude}, {longitude}
                    </Link>
                </div>
                </div>

                <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-gray-500" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Loại phản ánh</p>
                    <p>{feedback.type}</p>
                </div>
                </div>

                <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Ngày</p>
                    <p>{feedback.date}</p>
                </div>
                </div>

                <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Thời gian</p>
                    <p>{feedback.time}</p>
                </div>
                </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
                <h3 className="text-lg font-medium mb-2">Mô tả chi tiết</h3>
                <p className="text-gray-700 whitespace-pre-line">{feedback.description}</p>
            </div>

            <Separator />

            {/* Images */}
            <div>
                <h3 className="text-lg font-medium mb-3">Hình ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {feedback.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image
                        src={`/placeholder.svg?height=300&width=300`} // Replace with actual images in production
                        alt={`Feedback image ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                    </div>
                ))}
                </div>
            </div>

            <Separator />

            {/* Author Information */}
            <div>
                <h3 className="text-lg font-medium mb-3">Thông tin người gửi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                    <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                    <p>
                        {feedback.author} ({feedback.author_username})
                    </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p>{feedback.phone_number}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{feedback.email}</p>
                    </div>
                </div>
                </div>
            </div>

            <div className="text-xs text-gray-500 pt-4">
                <p>ID: {feedback._id}</p>
                <p>Tạo lúc: {new Date(feedback.created_at).toLocaleString("vi-VN")}</p>
                <p>Cập nhật lúc: {new Date(feedback.updated_at).toLocaleString("vi-VN")}</p>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}
