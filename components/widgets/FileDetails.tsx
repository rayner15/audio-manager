import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AudioCategory, AudioFileUpload } from "@/interface/audioFile";
import { formatFileSize } from "@/utils/common";
import { FileIcon } from "lucide-react";
import React from "react";

interface FileDetailsProps {
  selectedFile: AudioFileUpload | null;
  categories: AudioCategory[];
  selectedIndex: number;
  onUpdateFile: (index: number, updates: Partial<AudioFileUpload>) => void;
}

const FileDetails = ({
  selectedFile,
  categories,
  selectedIndex,
  onUpdateFile,
}: FileDetailsProps) => {
  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <FileIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Select a file to view details</p>
        </div>
      </div>
    );
  }

  // Extract file details
  const { file, description, categoryId } = selectedFile;
  const { name, size } = file;

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdateFile(selectedIndex, { description: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onUpdateFile(selectedIndex, { categoryId: value });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">File Details</h3>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">File Name</Label>
          <p className="text-sm font-medium text-gray-800 break-all">{name}</p>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Size</Label>
          <p className="text-sm font-medium text-gray-800">
            {formatFileSize(size)}
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description for this audio file"
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
