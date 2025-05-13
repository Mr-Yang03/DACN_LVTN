'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Định dạng không hỗ trợ',
        description: 'Vui lòng chọn file ảnh (jpg, png, gif, webp)',
        variant: 'destructive',
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File quá lớn',
        description: 'Kích thước file không được vượt quá 5MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImagePreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {imagePreview ? (
        <div className="relative w-full max-w-md">
          <Image
            src={imagePreview}
            alt="Preview"
            width={600}
            height={300}
            className="w-full h-auto rounded-md border border-gray-200"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-3 -right-3 h-8 w-8 rounded-full"
            onClick={handleRemove}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md h-32 flex flex-col items-center justify-center border-dashed gap-2"
          type="button"
        >
          <Upload className="h-6 w-6 text-gray-400" />
          <div className="text-sm text-gray-500">
            Nhấp để tải lên hoặc kéo thả ảnh vào đây
          </div>
          <div className="text-xs text-gray-400">
            SVG, PNG, JPG or GIF (tối đa 5MB)
          </div>
        </Button>
      )}
    </div>
  );
}