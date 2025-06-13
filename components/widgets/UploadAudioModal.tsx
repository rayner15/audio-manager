import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AudioCategory, AudioFile, UploadAudioModalProps } from "@/interface/audioFile";
import { useCallback, useEffect, useState } from 'react';
import DragDropArea from './DragDropArea';
import FileDetails from './FileDetails';
import FileList from './FileList';
import UploadProgress from './UploadProgress';

const UploadAudioModal = ({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadAudioModalProps) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<AudioCategory[]>([]);

  const selectedFileWithMetadata = selectedFileIndex >= 0 ? audioFiles[selectedFileIndex] : null;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (audioFiles.length > 0 && selectedFileIndex === -1) {
      setSelectedFileIndex(0);
    }
    if (audioFiles.length === 0) {
      setSelectedFileIndex(-1);
    }
  }, [audioFiles]);

  const handleFilesDrop = useCallback((files: File[]) => {
    const newFiles: AudioFile[] = files.map(file => ({
      file,
      description: '',
      categoryId: ''
    }));
    
    if (newFiles.length > 0) {
      setAudioFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    setAudioFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    
    if (selectedFileIndex === indexToRemove) {
      if (audioFiles.length > 1) {
        // Select the next file, or the previous if removing the last file
        const nextIndex = indexToRemove < audioFiles.length - 1 ? indexToRemove : indexToRemove - 1;
        setSelectedFileIndex(nextIndex);
      } else {
        setSelectedFileIndex(-1);
      }
    } else if (selectedFileIndex > indexToRemove) {
      // Adjust the selected index if removing a file before the selected one
      setSelectedFileIndex(selectedFileIndex - 1);
    }
  }, [audioFiles, selectedFileIndex]);

  const updateFile = useCallback((index: number, updates: Partial<AudioFile>) => {
    setAudioFiles(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  }, []);

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    audioFiles.forEach((fileWithMeta, index) => {
      formData.append('files', fileWithMeta.file);
      formData.append(`descriptions[${index}]`, fileWithMeta.description);
      formData.append(`categoryIds[${index}]`, fileWithMeta.categoryId);
    });
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (response.ok) {
        setAudioFiles([]);
        setUploadProgress(100);
        setTimeout(() => {
          onUploadComplete();
          setTimeout(() => setUploadProgress(0), 300);
        }, 800);
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Upload Audio Files
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add new audio files to your library - supports multiple uploads
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
              <DragDropArea onFilesDrop={handleFilesDrop} />
              <FileList 
                files={audioFiles}
                selectedIndex={selectedFileIndex}
                onSelectFile={setSelectedFileIndex}
                onRemoveFile={removeFile}
              />
            </div>
            <div className="space-y-6">
              <FileDetails 
                selectedFile={selectedFileWithMetadata}
                categories={categories}
                selectedIndex={selectedFileIndex}
                onUpdateFile={updateFile}
              />
              
              <UploadProgress 
                progress={uploadProgress}
                isUploading={isUploading}
              />
            </div>
          </div>
          <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                {audioFiles.length} {audioFiles.length === 1 ? 'file' : 'files'} selected
              </div>
              <Button 
                type="submit" 
                onClick={handleUpload} 
                disabled={isUploading || audioFiles.length === 0}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAudioModal; 