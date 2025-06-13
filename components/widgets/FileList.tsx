import { FileAudioIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { FileListProps } from '@/interface/audioFile';
import { formatFileSize } from '@/utils/common';

const FileList = ({
  files,
  selectedIndex,
  onSelectFile,
  onRemoveFile,
}: FileListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Files ({files.length})</h3>
      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
        {files.map((fileWithMeta, index) => (
          <div 
            key={`${fileWithMeta.file.name}-${index}`}
            className={`flex items-center justify-between p-2 rounded-lg ${
              selectedIndex === index ? 'bg-blue-100' : 'bg-gray-50'
            } hover:bg-blue-50 transition-colors duration-150`}
            onClick={() => onSelectFile(index)}
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <FileAudioIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate">{fileWithMeta.file.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${fileWithMeta.categoryId ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className="text-xs text-gray-500">{formatFileSize(fileWithMeta.file.size)}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(index);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList; 