import { LocateFixed } from "lucide-react";

export default function LocationButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed flex items-center justify-center 
                 w-8 h-8 bg-white rounded-full shadow-2xl hover:bg-gray-100"
    >
      <LocateFixed className="w-6 h-6 text-blue-700" />
    </button>
  );
}
