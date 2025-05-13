import type { Metadata } from 'next';
import React from 'react';

import AppProviders from '@/providers/app-provider';

import './globals.css';

export const metadata: Metadata = {
  title: "Hệ thống giám sát giao thông",
  description: "Hệ thống giám sát tình trạng giao thông đô thị dựa trên phân tích dữ liệu video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
