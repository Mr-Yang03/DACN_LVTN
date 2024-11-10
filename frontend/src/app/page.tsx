"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/images/logo-hcmut.png';
import { Button } from "@/components/ui/button";

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ModeToggle = ()=>{
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Navbar = () => (
  <nav>
    <div className="w-[100%] flex flex-wrap items-center justify-between mx-auto p-4 pr-4">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={logo} alt="logo" width={40} className="h-8"></Image>
          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">BK Traffic</span>
      </a>
      <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
      </button>
      <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul className="flex flex-col p-4 md:p-0 mt-4 text-lg font-semibold border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Trang chủ</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Bản đồ</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Tra cứu</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Phản ánh</a>
          </li>
        </ul>
      </div>
        {/* <ModeToggle/> */}
    </div>
  </nav>

);

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
        {functions.map(func => (
          <div key={func.id} className="bg-white p-6 rounded shadow-xl border-b-4 border-white hover:border-b-4 hover:border-green-500">
            <Link href={func.link}>
              <div className="flex flex-col items-center text-center">
                <Image src={func.imageUrl} alt={func.title}  width={100} height={100} className="mb-4" ></Image>
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
