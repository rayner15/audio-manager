import { Button } from "@/components/ui/button";
import StaticGlassCard from "@/components/widgets/StaticGlassCard";
import { motion } from "framer-motion";
import { UploadIcon } from "lucide-react";
import { useMemo, useState } from "react";
import AudioFiles from "./AudioFiles";
import CategoryFilter from "./CategoryFilter";
import { AudioFile as AudioFileInterface } from "@/interface/audioFile";

interface AudioLibraryProps {
  audioFiles: AudioFileInterface[];
  onDelete: (fileId: string) => Promise<void>;
  onUploadClick: () => void;
}

export default function AudioLibrary({
  audioFiles,
  onDelete,
  onUploadClick,
}: AudioLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = new Map();
    audioFiles.forEach((file) => {
      if (!uniqueCategories.has(file.category.id)) {
        uniqueCategories.set(file.category.id, file.category);
      }
    });
    return Array.from(uniqueCategories.values());
  }, [audioFiles]);

  // Filter audio files by selected category
  const filteredAudioFiles = useMemo(() => {
    if (selectedCategory === null) return audioFiles;
    return audioFiles.filter((file) => file.category.id === selectedCategory);
  }, [audioFiles, selectedCategory]);

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
                {filteredAudioFiles.length} files
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

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <AudioFiles
          audioFiles={filteredAudioFiles}
          onDelete={onDelete}
          categories={categories}
        />
      </StaticGlassCard>
    </motion.div>
  );
}
