import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import React from 'react';
import { UploadProgressProps } from '@/interface/audioFile';

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, isUploading }) => {
  if (!isUploading) return null;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Upload Progress</Label>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default UploadProgress; 