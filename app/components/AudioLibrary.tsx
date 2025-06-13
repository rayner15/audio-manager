import { MusicIcon } from "lucide-react";
import AudioPlayer from "@/components/widgets/AudioPlayer";

interface AudioFile {
  id: number;
  fileName: string;
  description?: string;
  category: { id: number; name: string };
  sizeBytes: number;
  uploadedAt: string;
}

interface AudioLibraryProps {
  audioFiles: AudioFile[];
  onDelete: (fileId: number) => Promise<void>;
}

export default function AudioLibrary({
  audioFiles,
  onDelete,
}: AudioLibraryProps) {
  return (
    <div className="glass-container">
      {audioFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <MusicIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No audio files yet
          </h3>
          <p className="text-white/80 mb-8">
            Upload your first audio file to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {audioFiles.map((file) => (
            <AudioPlayer key={file.id} file={file} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
