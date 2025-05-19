import Link from "next/link"
import { MapPin, Calendar, Clock, AlertTriangle, User, Phone, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react";
import FeedbackDetail from "@/components/ui/FeedbackDetail";

interface FeedbackDetailPageProps {
    params: Promise<{ id: string }>;
}

// In a real application, you would fetch the data based on the ID
export default async function FeedbackDetailPage( {params}: FeedbackDetailPageProps ) {
    // For demo purposes, we're using the static data
    const resolvedParams = await params; // Await params to resolve the Promise
    const id = resolvedParams?.id || 'unknown'; // Fallback for missing id
    
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/feedback" className="flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách
                    </Link>
                </Button>
            </div>

            <FeedbackDetail feedbackId={id} /> 
        </div>
    )
}
