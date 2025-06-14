import { MusicIcon } from "lucide-react";
import AudioPlayer from "@/components/widgets/AudioPlayer";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface AudioFile {
  id: string;
  fileName: string;
  description?: string;
  category: Category;
  sizeBytes: number;
  uploadedAt: string;
}

interface AudioFilesProps {
  audioFiles: AudioFile[];
  onDelete: (fileId: string) => Promise<void>;
  categories: Category[];
}

export default function AudioFiles({
  audioFiles,
  onDelete,
  categories,
}: AudioFilesProps) {
  return (
    <div className="px-4 pb-4">
      {audioFiles.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 bg-gray-100/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <MusicIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No audio files yet
          </h3>
          <p className="text-white/80 mb-8">
            Upload your first audio file to get started
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {audioFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                }}
              >
                <AudioPlayer
                  file={file}
                  onDelete={onDelete}
                  allCategories={categories}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
