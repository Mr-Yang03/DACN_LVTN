"use client";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();
  return (
    <div>
      <div className="h-100 flex flex-col items-center rounded-lg p-6 text-center pt-20">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-xl font-semibold">
          Phản ánh đã được gửi thành công
        </h2>
        <p className="mt-2 text-muted-foreground">
          Cảm ơn bạn đã gửi phản ánh về tình trạng giao thông. Chúng tôi sẽ xem
          xét và phản hồi sớm nhất có thể.
        </p>
        <Button className="mt-6" onClick={() => router.push("/feedback")}>
          Gửi phản ánh khác
        </Button>
      </div>
    </div>
  );
}
