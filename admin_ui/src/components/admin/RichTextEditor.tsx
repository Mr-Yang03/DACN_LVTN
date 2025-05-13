'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { RichTextContent } from './RichTextContent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sử dụng dynamic import để tránh lỗi SSR
const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: ReactQuill } = await import('react-quill-new');
    const { default: ImageResize } = await import('quill-image-resize-module-react');
    
    // Khởi tạo và cấu hình Quill editor
    if (typeof window !== 'undefined') {
      try {
        const Quill = ReactQuill.Quill;
        
        // Đăng ký module resize ảnh
        Quill.register('modules/imageResize', ImageResize);
        
        // Cấu hình hình ảnh
        const Image = Quill.import('formats/image');
        if (Image && typeof Image === 'function') {
          Image.prototype.className = 'custom-image-quill';
        }
      } catch (error) {
        console.error('Error initializing Quill modules:', error);
      }
    }

    const QuillWrapper = function (props: any) {
      return <ReactQuill {...props} />;
    };
    QuillWrapper.displayName = 'QuillWrapper';
    return QuillWrapper;
  },
  { ssr: false }
);

// Cấu hình modules đơn giản hơn để tránh xung đột
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false,] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    parchment: true,
    displaySize: true,
    modules: ['Resize', 'DisplaySize'],
  },
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'size', 'color', 'background',
  'list',
  'indent',
  'align',
  'link', 'image'
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value || '');
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('edit');

  useEffect(() => {
    setIsMounted(true);
    
    // Thêm CSS để hỗ trợ tùy chỉnh ảnh trong editor
    if (typeof document !== 'undefined') {
      const styleId = 'quill-editor-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .custom-image-quill {
            display: inline-block;
            max-width: 100%;
            height: auto;
          }
          .ql-align-center {
            text-align: center;
          }
          .ql-align-right {
            text-align: right;
          }
          .ql-align-justify {
            text-align: justify;
          }
          
          /* Căn lề ảnh */
          .ql-editor img {
            max-width: 100%;
          }
          .ql-editor .ql-size-small {
            font-size: 0.75em;
          }
          .ql-editor .ql-size-large {
            font-size: 1.5em;
          }
          .ql-editor .ql-size-huge {
            font-size: 2.5em;
          }
          
          /* Hỗ trợ float ảnh để tạo bố cục nửa ảnh nửa chữ */
          .ql-editor p img {
            display: inline-block;
          }
          .ql-editor p img.float-left {
            float: left;
            margin-right: 16px;
            margin-bottom: 8px;
            max-width: 50%;
          }
          .ql-editor p img.float-right {
            float: right;
            margin-left: 16px;
            margin-bottom: 8px;
            max-width: 50%;
          }
          
          .ql-editor {
            min-height: 300px;
          }
          
          /* Style cho chế độ xem trước */
          .preview-wrapper {
            min-height: 300px;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 0.375rem;
            background-color: white;
            overflow-y: auto;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    return () => {
      // Cleanup code nếu cần
    };
  }, []);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <div className="rich-text-editor">
      {isMounted && (
        <Tabs 
          defaultValue="edit" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="edit">Soạn thảo</TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit" className="mt-0">
            <QuillNoSSRWrapper
              value={editorValue}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              theme="snow"
              className="min-h-[300px] overflow-y-auto border rounded-md"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
            <div className="preview-wrapper">
              <RichTextContent content={editorValue} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}