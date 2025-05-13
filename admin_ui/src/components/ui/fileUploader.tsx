import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X } from 'lucide-react';

interface FileUploadProps {
  field: {
    value: FileList | null
    onChange: (files: FileList | null) => void
  }
}

export default function FileUploader({ field }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const dt = new DataTransfer()
      acceptedFiles.forEach((file) => dt.items.add(file))
      if (field.value) {
        Array.from(field.value).forEach((file) => dt.items.add(file))
      }
      field.onChange(dt.files)
    },
    [field]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const formatSize = (size: number) => {
    return size < 1024
      ? `${size} B`
      : size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const removeFile = (index: number) => {
    const dt = new DataTransfer()
    Array.from(field.value || [])
      .filter((_, i) => i !== index)
      .forEach((file) => dt.items.add(file))
    field.onChange(dt.files.length > 0 ? dt.files : null)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer bg-gray-100 ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Thả file vào đây...</p>
        ) : (
          <p>Nhấp để tải file lên hoặc kéo thả</p>
        )}
      </div>

      {field.value && field.value.length > 0 && (
        <div className="mt-3 space-y-2">
          {Array.from(field.value).map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-2 py-1 border rounded"
            >
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate w-4/5"
              >
                {file.name} ({formatSize(file.size)})
              </a>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
