import { motion } from 'framer-motion';
import { UploadIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import { DragDropAreaProps } from '@/interface/audioFile';
import { ALLOWED_AUDIO_TYPES, MAX_FILE_SIZE } from '@/constants/audioFile';

export const DragDropArea: React.FC<DragDropAreaProps> = ({
  onFilesDrop,
  allowedTypes = ALLOWED_AUDIO_TYPES,
  maxFileSize = MAX_FILE_SIZE
}) => {
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles?.length) return;
    
    const validFiles: File[] = [];
    let hasInvalidFile = false;
    
    Array.from(droppedFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        hasInvalidFile = true;
        return;
      }
      if (file.size > maxFileSize) {
        hasInvalidFile = true;
        return;
      }
      validFiles.push(file);
    });
    
    if (hasInvalidFile) {
      alert('Some files were skipped. Please ensure all files are valid audio files (MP3, WAV, or M4A) and less than 25MB.');
    }
    
    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  }, [allowedTypes, maxFileSize, onFilesDrop]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const validFiles: File[] = [];
    let hasInvalidFile = false;
    
    Array.from(e.target.files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        hasInvalidFile = true;
        return;
      }
      if (file.size > maxFileSize) {
        hasInvalidFile = true;
        return;
      }
      validFiles.push(file);
    });
    
    if (hasInvalidFile) {
      alert('Some files were skipped. Please ensure all files are valid audio files (MP3, WAV, or M4A) and less than 25MB.');
    }
    
    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  }, [allowedTypes, maxFileSize, onFilesDrop]);

  return (
    <>
      <div
        className="border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-200 
                 rounded-xl p-6 flex flex-col items-center justify-center h-64 bg-blue-50/30 
                 cursor-pointer group hover:bg-blue-50/50 hover:shadow-md"
        onClick={() => document.getElementById('file-input')?.click()}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.add('border-blue-500', 'bg-blue-50/70');
        }}
        onDragLeave={e => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/70');
        }}
        onDrop={handleFileDrop}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="bg-blue-100 rounded-full p-4 mb-4 group-hover:bg-blue-200 transition-colors duration-200"
        >
          <UploadIcon className="w-10 h-10 text-blue-500 group-hover:text-blue-600" />
        </motion.div>
        <p className="text-gray-700 font-medium text-center mb-1">
          Drag & drop your audio files here
        </p>
        <p className="text-gray-500 text-sm text-center">
          or click to browse
        </p>
        <p className="text-xs text-blue-600 mt-4 font-medium">
          Supports MP3, WAV, M4A (max 25MB each)
        </p>
      </div>
      
      <input
        id="file-input"
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
    </>
  );
};

export default DragDropArea; 