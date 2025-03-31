"use client";

import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

const Page: React.FC = () => {
    

    return (
        <>
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[center_top_-1px]" />
                <div
                    className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center"
                    style={{ backgroundImage: "url('/image/images.jpg?height=600&width=1200')" }}
                />

                <div className="container relative z-10 py-12">
                    <div className="max-w-2xl m-10 p-10 bg-gray-400 bg-opacity-80 rounded-lg">
                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                            Cập nhật tin tức giao thông mới nhất
                        </h1>
                        <p className="mt-4 text-lg text-blue-100">
                            Thông tin về tình hình giao thông, sự cố, công trình và các quy định mới
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/feedback">
                                    Gửi phản ánh
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                                <Link href="/map">Xem bản đồ giao thông</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="py-10"
            >
                <Tabs defaultValue="news" className="w-1/2">
                    <TabsList className="grid w-full grid-cols-2 mb-8 px-10">
                        <TabsTrigger value="news" className="text-lg py-3">
                            Tin tức
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="text-lg py-3">
                            Phản ánh từ người dân
                        </TabsTrigger>
                    </TabsList>

                    {/* News Tab Content */}
                    <TabsContent value="news">
                        
                    </TabsContent>

                    {/* Feedback Tab Content */}
                    <TabsContent value="feedback">
                        
                    </TabsContent>
                </Tabs>
            </div>
                
        </>
            
    )
}

export default Page;