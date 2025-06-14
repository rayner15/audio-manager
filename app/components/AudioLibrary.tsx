import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import StaticGlassCard from "@/components/widgets/StaticGlassCard";
import AudioFiles from "./AudioFiles";
import { motion } from "framer-motion";

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
  onUploadClick: () => void;
}

export default function AudioLibrary({
  audioFiles,
  onDelete,
  onUploadClick,
}: AudioLibraryProps) {
  return (
    <motion.div
      className="col-span-1 xl:col-span-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <StaticGlassCard>
        <div className="px-4 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h2 className="text-xl text-white font-bold">
                Your Audio Library
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {audioFiles.length} files
              </span>
            </div>
            <Button
              variant="outline"
              className="flex items-center bg-white/10 hover:bg-white/20 text-white border-white/30"
              onClick={onUploadClick}
            >
              <UploadIcon className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
        <AudioFiles audioFiles={audioFiles} onDelete={onDelete} />
      </StaticGlassCard>
    </motion.div>
  );
}
