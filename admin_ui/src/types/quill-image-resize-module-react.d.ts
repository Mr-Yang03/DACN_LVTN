declare module 'quill-image-resize-module-react' {
  import Quill from 'quill-new';
  
  interface ImageResizeOptions {
    modules?: string[];
    handleStyles?: {
      backgroundColor?: string;
      border?: string;
      color?: string;
    };
    displaySize?: boolean;
    displayStyles?: boolean;
    alignment?: boolean;
    toolbarStyles?: {
      backgroundColor?: string;
      border?: string;
      color?: string;
    };
  }
  
  class ImageResize {
    constructor(quill: Quill, options: ImageResizeOptions);
  }
  
  export default ImageResize;
}