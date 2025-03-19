"use client";

import GoongMap from "@/components/ui/GoongMap";

const Page: React.FC = () => {
    return (
        <div
            className="w-full flex flex-col"
        >
            <div
                className="text-3xl font-bold text-center p-4"
            >
                Phản ánh tình trạng giao thông
            </div>
            <div
                className="flex w-full my-4"
            >
                <div
                    className="w-3/5 p-4 ml-4 rounded-lg bg-white border-2"
                >
                    <GoongMap controls={{ navigation: true, geolocate: true, search: true}} />   
                </div>
                <div
                    className="w-2/5 px-4"
                >
                    <form
                        className="flex flex-col space-y-4"
                    >
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Điểm bắt đầu
                            </label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                id="feedback-title"
                                name="feedback-title"
                                type="text"
                            />
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Điểm kết thúc
                            </label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                id="feedback-title"
                                name="feedback-title"
                                type="text"
                            />
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Tốc độ (km/h)
                            </label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                id="feedback-title"
                                name="feedback-title"
                                type="number"
                            />
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Thời tiết
                            </label>
                            <select name="weather" id="weather" className="w-full p-2 border border-gray-300 rounded-lg">
                                <option value="sun">Chọn thời tiết</option>
                                <option value="little rain">Mưa nhỏ</option>
                                <option value="heavy rain">Mưa to</option>
                                <option value="windy">Gió to</option>
                                <option value="sunny">Nắng</option>
                                <option value="cloudy">Nhiều mây</option>
                                <option value="fog">Sương mù</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Tình trạng đường
                            </label>
                            <select name="road" id="road" className="w-full p-2 border border-gray-300 rounded-lg">
                                <option value="opt">Chọn tình trạng đường</option>
                                <option value="good">Tốt</option>
                                <option value="normal">Bình thường</option>
                                <option value="bad">Xấu</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-title"
                            >
                                Nguyên nhân
                            </label>
                            <select name="traffic" id="traffic" className="w-full p-2 border border-gray-300 rounded-lg">
                                <option value="normal">Bình thường</option>
                                <option value="flood">Ngập lụt</option>
                                <option value="accident">Tai nạn</option>
                                <option value="police">Công an</option>
                                <option value="construction">Xây dựng</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-content"
                            >
                                Mô tả (nếu có)
                            </label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                id="feedback-content"
                                name="feedback-content"
                            />
                        </div>
                        <div>
                            <label
                                className="text-lg font-semibold"
                                htmlFor="feedback-image"
                            >
                                Hình ảnh, video
                            </label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                id="feedback-image"
                                name="feedback-image"
                                type="file"
                            />
                        </div>
                        <div>
                            <button
                                className="w-full bg-blue-500 text-white p-2 rounded-lg"
                                type="submit"
                            >
                                Gửi phản ánh
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Page