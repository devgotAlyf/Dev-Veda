import React, { useRef, useState } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    const validTypes = ['application/pdf', 'text/plain'];
    if (validTypes.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert('Please upload a PDF or TXT file.');
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />
      
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-amber bg-amber/5' 
              : 'border-navy-700/30 hover:border-amber/50 hover:bg-cream-100/50'
          }`}
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-navy">
            <UploadCloud size={24} />
          </div>
          <p className="font-serif font-bold text-navy text-center mb-1">
            Upload Reference Material
          </p>
          <p className="text-sm text-muted text-center max-w-xs">
            Drag and drop a PDF or TXT file here, or click to browse
          </p>
        </div>
      ) : (
        <div className="border border-ink/10 bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-cream flex items-center justify-center rounded-lg text-amber shrink-0">
              <FileIcon size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-navy text-sm truncate pr-4">{selectedFile.name}</p>
              <p className="text-xs text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="p-2 text-muted hover:text-rose hover:bg-rose/10 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
