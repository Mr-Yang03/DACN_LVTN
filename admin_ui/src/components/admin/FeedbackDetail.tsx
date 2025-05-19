"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Clock, AlertTriangle, User, Phone, Mail, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { getFeedback } from "@/apis/feedbackApi"

// This would typically come from your database

// In a real application, you would fetch the data based on the ID
export default function FeedbackDetail({ feedbackId }: { feedbackId: string }) {
    const [feedbackData, setFeedbackData] = useState({
        _id: "",
        title: "",
        location: "",
        type: "",
        severity: "",
        description: "",
        images: [],
        author: "",
        author_username: "",
        phone_number: "",
        email: "",
        date: "",
        time: "",
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await getFeedback(feedbackId)
                if (data) setFeedbackData(data.data)
            } catch (error) {
                console.error("Error fetching feedback:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFeedback()
    }, [feedbackId])

    console.log("Feedback Data:", feedbackData)

    // Check if location is in coordinate format (latitude, longitude)
    const isCoordinateFormat = (location: string) => {
        // Regular expression to match two decimal numbers separated by comma and space
        const coordinatePattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/
        return coordinatePattern.test(location)
    }

    // Process location based on format
    const isCoordinate = isCoordinateFormat(feedbackData.location)
    let latitude, longitude, googleMapsUrl

    if (isCoordinate) {
        ;[latitude, longitude] = feedbackData.location.split(", ")
        googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    }

    // Determine severity color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
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
            {
                feedbackData && (
                    <Card className="mb-8">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-2xl font-bold">{feedbackData.title}</CardTitle>
                                <Badge className={getSeverityColor(feedbackData.severity)}>{feedbackData.severity}</Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Vị trí</p>
                                        {isCoordinate ? (
                                            <Link
                                                href={googleMapsUrl ? googleMapsUrl : "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {latitude}, {longitude}
                                            </Link>
                                        ) : (
                                            <p>{feedbackData.location}</p>
                                        )}
                                        {/* <p>{feedbackData.location}</p> */}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Loại phản ánh</p>
                                        <p>{feedbackData.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ngày</p>
                                        <p>{feedbackData.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Thời gian</p>
                                        <p>{feedbackData.time}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Mô tả chi tiết</h3>
                                <p className="text-gray-700 whitespace-pre-line">{feedbackData.description}</p>
                            </div>

                            <Separator />

                            {/* Images */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">Hình ảnh</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {feedbackData.images && feedbackData.images.map((image, index) => (
                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image
                                            src={`${image}?height=300&width=300`} // Replace with actual images in production
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
                                                {feedbackData.author} ({feedbackData.author_username})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                            <p>{feedbackData.phone_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p>{feedbackData.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}
