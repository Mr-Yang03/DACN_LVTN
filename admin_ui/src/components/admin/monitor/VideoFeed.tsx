import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Pause, Play, RefreshCw, Maximize2, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoFeedProps {
  selectedCamera: {
    id: string;
    name: string;
    status: "online" | "offline";
  };
  isTestMode: boolean;
  isPlaying: boolean;
  snapshotUrl: string;
  onPlayPause: () => void;
  onRefreshSnapshot: (cameraId: string) => void;
  onFullScreenToggle: () => void;
}

export function VideoFeed({
  selectedCamera,
  isTestMode,
  isPlaying,
  snapshotUrl,
  onPlayPause,
  onRefreshSnapshot,
  onFullScreenToggle,
}: VideoFeedProps) {  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [totalFrames] = useState(1331); // Total number of frames in the directory

  // Effect to update the frame index when playing
  useEffect(() => {
    let frameInterval: NodeJS.Timeout | null = null;
    
    if (isTestMode && isPlaying) {
      frameInterval = setInterval(() => {
        setCurrentFrameIndex((prevIndex) => 
          prevIndex >= totalFrames - 1 ? 0 : prevIndex + 1
        );
      }, 100);
    }
    
    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isTestMode, isPlaying, totalFrames]);

  return (
    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative" ref={feedContainerRef}>        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          {isTestMode ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={`/frame/frame_${currentFrameIndex}.jpg?t=${Date.now()}`}
                alt={`Test mode frame ${currentFrameIndex}`}
                className="w-full h-full object-contain"
                width={1280}
                height={720}
                priority
                unoptimized={true}
                onError={(e) => {
                  console.error("Error loading frame", currentFrameIndex);
                }}
              />
              {/* <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white text-xs rounded">
                Frame: {currentFrameIndex} / {totalFrames - 1}
              </div> */}
            </div>
          ) : snapshotUrl && selectedCamera.id ? (
            <Image
              src={snapshotUrl}
              alt={`Camera feed from ${selectedCamera.name}`}
              className="w-full h-full object-contain"
              onError={() => {
                console.error("Error loading snapshot");
              }}
              width={1280}
              height={720}
            />
          ) : (
            <div className="text-center px-6 py-10">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Camera className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-white font-medium mb-3">
                {selectedCamera.name}
              </p>
              <p className="text-sm text-slate-400">
                Đang tải dữ liệu video...
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
          <span
            className={`w-2 h-2 rounded-full ${
              selectedCamera.status === "online"
                ? "bg-green-500 animate-pulse"
                : "bg-red-500"
            }`}
          ></span>
          <span className="text-xs font-medium text-white capitalize">
            {selectedCamera.status === "online"
              ? "Trực tuyến"
              : "Ngoại tuyến"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 text-white p-3 flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => onRefreshSnapshot(selectedCamera.id)}
          >
            <RefreshCw size={16} />
          </button>
          <div className="flex-1"></div>
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={onFullScreenToggle}
          >
            {/* <Maximize2 size={16} /> */}
          </button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-blue-600" />
            {selectedCamera.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Dữ liệu từ camera được chọn trên bản đồ. Nhấn vào biểu tượng
          camera để thay đổi góc nhìn.
        </p>
      </CardContent>
    </Card>
  );
}