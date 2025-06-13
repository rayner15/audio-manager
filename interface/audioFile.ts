// Database and service interfaces
export interface CreateAudioFileData {
  accountId: number;
  categoryId: number;
  fileName: string;
  filePath: string;
  description?: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UpdateAudioFileData {
  description?: string;
  categoryId?: number;
}

// Frontend component interfaces
export interface AudioFile {
  file: File;
  description: string;
  categoryId: string;
}

export interface AudioCategory {
  id: number;
  name: string;
}

// Component specific props interfaces
export interface UploadAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

export interface DragDropAreaProps {
  onFilesDrop: (files: File[]) => void;
  allowedTypes?: string[];
  maxFileSize?: number;
}

export interface FileListProps {
  files: AudioFile[];
  selectedIndex: number;
  onSelectFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
}

export interface FileDetailsProps {
  selectedFile: AudioFile | null;
  categories: AudioCategory[];
  selectedIndex: number;
  onUpdateFile: (index: number, updates: Partial<AudioFile>) => void;
}

export interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

