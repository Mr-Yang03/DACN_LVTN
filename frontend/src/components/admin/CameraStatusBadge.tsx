interface CameraStatusBadgeProps {
    status: "online" | "offline";
  }
  
  export default function CameraStatusBadge({ status }: CameraStatusBadgeProps) {
    const color = status === "online" ? "bg-green-500" : "bg-red-500";
    const text = status === "online" ? "Đang hoạt động" : "Mất kết nối";
  
    return (
      <span className={`inline-flex items-center px-2 py-1 text-white text-xs rounded ${color}`}>
        {text}
      </span>
    );
  }
  