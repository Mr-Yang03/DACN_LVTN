"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const HeroSection = () => (
  <section className="bg-gray-200 py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ho Chi Minh City Traffic Portal</h1>
      <p className="text-lg mb-8">Get the latest updates on traffic conditions in Ho Chi Minh City.</p>
      <Button variant="outline" className="bg-blue-600 text-white px-6 py-2 rounded">Learn More</Button>
    </div>
  </section>
);

const Utilities = () => {
  const functions = [
    { id: 1, title: "Camera giao thông", imageUrl: "/images/icon-camera.png", link: "#" },
    { id: 2, title: "Bản đồ", imageUrl: "/images/icon-map.png", link: "#" },
    { id: 3, title: "Tra cứu", imageUrl: "/images/icon-lookup.png", link: "#" },
    { id: 4, title: "Tin tức", imageUrl: "/images/icon-news.png", link: "#" },
    { id: 5, title: "Thời tiết", imageUrl: "/images/icon-weather.png", link: "#" },
    { id: 6, title: "Tai nạn", imageUrl: "/images/icon-accident.png", link: "#" },
    { id: 7, title: "Phản ánh", imageUrl: "/images/icon-feedback.png", link: "#" },
  ];

  return (
    <section className="container mx-auto py-10 p-10">
      <h2 className="text-3xl text-center font-bold mb-6">Tiện ích</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functions.map((func) => (
          <div key={func.id} className="bg-white p-6 rounded shadow-xl border-b-4 border-white hover:border-b-4 hover:border-green-500">
            <Link href={func.link}>
              <div className="flex flex-col items-center text-center">
                <Image src={func.imageUrl} alt={func.title} width={100} height={100} className="mb-4" />
                <h3 className="text-xl font-bold">{func.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-blue-600 text-white py-6">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 Ho Chi Minh City Traffic Portal. All rights reserved.</p>
    </div>
  </footer>
);

const Home = () => (
  <div>
    <Navbar />
    <HeroSection />
    <Utilities />
    <Footer />
  </div>
);

export default Home;
