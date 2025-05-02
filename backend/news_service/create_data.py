from pymongo import MongoClient
import os
from dotenv import load_dotenv
import datetime

# Load environment variables from .env file
load_dotenv()

# Connect MongoDB
MONGO_URI = os.getenv("MONGO_URI", "")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["News"]

news_collection = db["Items"]

# Delete all existing data in the collection
news_collection.delete_many({})

# Helper function to convert date and time strings to ISODate
def convert_to_timestamp(date_str, time_str):
    day, month, year = map(int, date_str.split('/'))
    hour, minute = map(int, time_str.split(':'))
    return datetime.datetime(year, month, day, hour, minute)

# Sample news data
news_data = [
    {
        "title": "Hướng dẫn đi lại trong dịp lễ 30/4-1/5",
        "category": "Giao thông",
        "author": "Nguyễn Văn A",
        "image": "https://example.com/image1.jpg",
        "publishDate": "28/04/2025",
        "publishTime": "08:30",
        "timestamp": convert_to_timestamp("28/04/2025", "08:30"),
        "status": "published",
        "featured": True,
        "tags": ["lễ", "giao thông", "hướng dẫn", "kẹt xe"],
        "summary": "Sở GTVT TP.HCM công bố kế hoạch phân luồng dịp lễ 30/4-1/5, khuyến cáo tránh các tuyến đường trung tâm vào giờ cao điểm.",
        "content": "<p>Sở Giao thông Vận tải TP.HCM vừa công bố kế hoạch phân luồng và hướng dẫn đi lại trong dịp lễ 30/4-1/5 nhằm giảm tình trạng ùn tắc trên các tuyến đường chính.</p><p>Theo đó, người dân nên tránh các tuyến đường như Nguyễn Huệ, Lê Duẩn, Nam Kỳ Khởi Nghĩa vào các khung giờ cao điểm từ 17h-22h trong các ngày lễ do khu vực này sẽ diễn ra nhiều hoạt động văn hóa, nghệ thuật.</p>"
    },
    {
        "title": "Cập nhật tình hình kẹt xe nghiêm trọng tại đường Võ Văn Kiệt",
        "category": "Giao thông",
        "author": "Trần Văn B",
        "image": "https://example.com/image1.jpg",
        "publishDate": "01/05/2025",
        "publishTime": "10:15",
        "timestamp": convert_to_timestamp("01/05/2025", "10:15"),
        "status": "published",
        "featured": True,
        "tags": ["kẹt xe", "giao thông", "cập nhật", "lễ"],
        "summary": "Ùn tắc kéo dài hơn 3km trên đường Võ Văn Kiệt, đoạn từ cầu Calmette đến vòng xoay Lý Thái Tổ do lượng người dân đổ về trung tâm quá đông.",
        "content": "<p>Tình hình giao thông tại đường Võ Văn Kiệt đang diễn ra hết sức phức tạp với lưu lượng phương tiện tăng đột biến trong sáng nay. Theo ghi nhận, đoạn từ cầu Calmette đến vòng xoay Lý Thái Tổ đang xảy ra tình trạng ùn tắc kéo dài hơn 3km.</p><p>Nguyên nhân được xác định do lượng người dân đổ về trung tâm thành phố tham gia các hoạt động vui chơi, giải trí nhân dịp lễ 1/5 quá đông, cộng với việc một số tuyến đường lân cận đang được thi công sửa chữa.</p>"
    },
    {
        "title": "Tai nạn liên hoàn trên cao tốc TP.HCM - Long Thành - Dầu Giây",
        "category": "Tai nạn",
        "author": "Lê Thị C",
        "image": "https://example.com/image1.jpg",
        "publishDate": "02/05/2025",
        "publishTime": "07:45",
        "timestamp": convert_to_timestamp("02/05/2025", "07:45"),
        "status": "published",
        "featured": False,
        "tags": ["tai nạn", "cao tốc", "ùn tắc", "giao thông"],
        "summary": "Tai nạn liên hoàn giữa 4 xe ô tô tại Km34+500 trên cao tốc TP.HCM - Long Thành - Dầu Giây, không có thiệt hại về người.",
        "content": "<p>Vào lúc 6h30 sáng nay, một vụ tai nạn liên hoàn giữa 4 xe ô tô đã xảy ra tại Km34+500 trên cao tốc TP.HCM - Long Thành - Dầu Giây, hướng từ Long Thành đi TP.HCM.</p><p>Theo thông tin ban đầu, nguyên nhân vụ tai nạn là do một xe container đã phanh gấp để tránh vật cản trên đường, dẫn đến các xe phía sau không kịp xử lý tình huống. Rất may không có thiệt hại về người, chỉ có thiệt hại về tài sản. Hiện tại, lực lượng chức năng đang có mặt tại hiện trường để giải quyết vụ việc.</p>"
    },
    {
        "title": "Cảnh báo mưa lớn gây ngập úng nhiều tuyến đường nội thành",
        "category": "Thời tiết",
        "author": "Phạm Thị D",
        "image": "https://example.com/image1.jpg",
        "publishDate": "23/03/2025",
        "publishTime": "16:00",
        "timestamp": convert_to_timestamp("23/03/2025", "16:00"),
        "status": "processing",
        "featured": False,
        "tags": ["mưa lớn", "ngập úng", "cảnh báo", "thời tiết"],
        "summary": "Cảnh báo mưa vừa đến mưa to kéo dài với lượng mưa 40-70mm, có thể gây ngập úng nhiều tuyến đường nội thành như Nguyễn Hữu Cảnh, Kinh Dương Vương.",
        "content": "<p>Trung tâm Khí tượng Thủy văn cảnh báo từ chiều nay đến hết ngày mai, khu vực nội thành sẽ có mưa vừa đến mưa to, có nơi mưa rất to với lượng mưa phổ biến từ 40-70mm, có nơi trên 100mm.</p><p>Người dân cần đặc biệt lưu ý các khu vực thường xuyên ngập úng như Nguyễn Hữu Cảnh, Kinh Dương Vương, An Dương Vương. Đề nghị người dân không đi vào các khu vực ngập sâu và tuân thủ hướng dẫn của lực lượng chức năng.</p>"
    },
    {
        "title": "Tuyến metro số 1 Bến Thành - Suối Tiên dự kiến vận hành thương mại vào cuối năm",
        "category": "Giao thông",
        "author": "Hoàng Văn E",
        "image": "https://example.com/image1.jpg",
        "publishDate": "15/04/2025",
        "publishTime": "09:00",
        "timestamp": convert_to_timestamp("15/04/2025", "09:00"),
        "status": "draft",
        "featured": True,
        "tags": ["metro", "giao thông công cộng", "vận hành", "phát triển"],
        "summary": "Tuyến metro số 1 Bến Thành - Suối Tiên đã hoàn thành hơn 95% khối lượng công việc, dự kiến vận hành thương mại vào cuối năm nay.",
        "content": "<p>Ban Quản lý Đường sắt Đô thị TP.HCM vừa cho biết, tuyến metro số 1 Bến Thành - Suối Tiên đã hoàn thành hơn 95% khối lượng công việc và dự kiến sẽ vận hành thương mại vào cuối năm nay.</p><p>Hiện nay, các đơn vị liên quan đang tập trung hoàn thiện các hạng mục còn lại, đồng thời triển khai công tác đào tạo nhân sự vận hành và bảo trì. Dự án này khi đi vào hoạt động sẽ góp phần giảm áp lực giao thông cho khu vực phía Đông thành phố.</p>"
    }
]

# Insert data into collection
result = news_collection.insert_many(news_data)

# Print result
print(f"Inserted {len(result.inserted_ids)} documents")
print("Inserted IDs:", result.inserted_ids)