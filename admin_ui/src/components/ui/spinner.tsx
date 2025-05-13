"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };
  
  return (
    <Loader2 className={cn(`animate-spin ${sizeClasses[size]}`, className)} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <Spinner size="xl" className="text-primary" />
    </div>
  );
}

export function ContentSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-24">
      <Spinner size="lg" className="text-primary" />
    </div>
  );
}