// Database and service interfaces
export interface CreateAudioFileData {
  accountId: string;
  categoryId: string;
  fileName: string;
  filePath: string;
  description?: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UpdateAudioFileData {
  description?: string;
  categoryId?: string;
}

// Frontend component interfaces
export interface AudioFileUpload {
  file: File;
  description: string;
  categoryId: string;
}

export interface AudioCategory {
  id: string;
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
  files: AudioFileUpload[];
  selectedIndex: number;
  onSelectFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
}

export interface FileDetailsProps {
  selectedFile: AudioFileUpload | null;
  categories: AudioCategory[];
  selectedIndex: number;
  onUpdateFile: (index: number, updates: Partial<AudioFileUpload>) => void;
}

export interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

// Database audio file model
export interface AudioFile {
  id: string;
  fileName: string;
  description?: string;
  category: AudioCategory;
  sizeBytes: number;
  uploadedAt: string;
}
