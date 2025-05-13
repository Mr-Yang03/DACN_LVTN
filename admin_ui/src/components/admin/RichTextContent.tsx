'use client';

import { useEffect } from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className = '' }: RichTextContentProps) {
  useEffect(() => {
    // Thêm CSS khi component được mount để đảm bảo hiển thị đúng
    if (typeof document !== 'undefined') {
      // Kiểm tra xem đã có style này chưa để tránh thêm nhiều lần
      const styleId = 'rich-text-content-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .rich-text-content img {
            max-width: 100%;
            height: auto;
            display: inline-block;
          }
          
          .rich-text-content .ql-align-center {
            text-align: center;
          }
          
          .rich-text-content .ql-align-right {
            text-align: right;
          }
          
          .rich-text-content .ql-align-justify {
            text-align: justify;
          }
          
          .rich-text-content p {
            margin-bottom: 1em;
          }
          
          .rich-text-content h1 {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 0.5em;
          }
          
          .rich-text-content h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 0.5em;
          }
          
          .rich-text-content h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin-bottom: 0.5em;
          }
          
          .rich-text-content ul {
            list-style-type: disc;
            margin-left: 2em;
            margin-bottom: 1em;
          }
          
          .rich-text-content ol {
            list-style-type: decimal;
            margin-left: 2em;
            margin-bottom: 1em;
          }
          
          .rich-text-content blockquote {
            border-left: 4px solid #ccc;
            margin-bottom: 1em;
            padding-left: 1em;
            color: #666;
          }
          
          .rich-text-content .ql-size-small {
            font-size: 0.75em;
          }
          
          .rich-text-content .ql-size-large {
            font-size: 1.5em;
          }
          
          .rich-text-content .ql-size-huge {
            font-size: 2.5em;
          }
          
          .rich-text-content img.float-left {
            float: left;
            margin-right: 1em;
            margin-bottom: 0.5em;
            max-width: 50%;
          }
          
          .rich-text-content img.float-right {
            float: right;
            margin-left: 1em;
            margin-bottom: 0.5em;
            max-width: 50%;
          }
          
          .rich-text-content a {
            color: #0066cc;
            text-decoration: underline;
          }
          
          .rich-text-content pre {
            background-color: #f0f0f0;
            padding: 1em;
            border-radius: 4px;
            font-family: monospace;
            overflow: auto;
            margin-bottom: 1em;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}