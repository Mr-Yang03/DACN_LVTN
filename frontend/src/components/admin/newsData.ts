// News data structure with updated schema
export const newsData = {
  id: 6, // Using next ID
  title: "Tạm ngừng lưu thông tại đường Lê Duẩn để phục vụ Lễ hội",
  date: "2025-04-26",
  time: "18:00",
  severity: "normal",
  image: "https://example.com/images/chan-duong-le-hoi.jpg",
  status: "published", // Changed from isProcessed & isDeleted to status
  category: "regulation", // Added category
  categoryName: "Quy định mới", // Added display name for category
  content: `<p>UBND quận 1 thông báo tạm cấm các phương tiện lưu thông qua đường Lê Duẩn trong 3 ngày 26-28/04/2025 để phục vụ tổ chức Lễ hội mùa xuân.</p>
<p>Các phương tiện sẽ được điều hướng đi theo các tuyến đường Nguyễn Thị Minh Khai, Nam Kỳ Khởi Nghĩa và Nguyễn Du.</p>
<p>Đề nghị người dân lưu ý và lên kế hoạch di chuyển phù hợp.</p>`, // Changed from description to content with HTML
  author: "Admin", // Added author field for consistency
  featured: false // Added featured flag
};