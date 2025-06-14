"use client";

import { Progress } from "@/components/ui/progress";
import UploadAudioModal from "@/components/widgets/UploadAudioModal";
import { motion } from "framer-motion";
import { MusicIcon, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/widgets/Layout";
import NavigationBar from "../../components/widgets/NavigationBar";
import "../../styles/glass.css";
import AudioLibrary from "../components/AudioLibrary";

interface AudioFile {
  id: number;
  fileName: string;
  description?: string;
  category: { id: number; name: string };
  sizeBytes: number;
  uploadedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAudioFiles();
    }
  }, [session]);

  const handleDeleteAudio = async (fileId: number) => {
    if (confirm("Are you sure you want to delete this audio file?")) {
      try {
        const response = await fetch(`/api/audio/${fileId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAudioFiles();
        } else {
          alert("Failed to delete audio file");
        }
      } catch (error) {
        console.error("Error deleting audio file:", error);
        alert("An error occurred while deleting the audio file");
      }
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch("/api/audio");
      if (response.ok) {
        const data = await response.json();
        setAudioFiles(data.audioFiles);
      }
    } catch (error) {
      console.error("Error fetching audio files:", error);
    }
  };

  if (status === "loading") {
    return (
      <Layout backgroundType="blue" useGradient={true}>
        <div className="relative w-full h-full min-h-screen">
          <div className="flex items-center justify-center min-h-screen relative z-10">
            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MusicIcon className="w-10 h-10 text-white" />
              </motion.div>
              <div className="w-64 mb-4">
                <Progress className="h-2" value={90} />
              </div>
              <p className="text-white font-medium">
                Loading your audio hub...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout backgroundType="blue" useGradient={true}>
      <div className="relative w-full h-full min-h-screen">
        <div className="relative z-10">
          <NavigationBar />
          <div className="container mx-auto px-6 py-10">
            {/* Welcome Section */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-blue-200" />
                <p className="text-blue-200 text-sm font-medium tracking-wide uppercase">
                  Dashboard
                </p>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  {session.user?.name || (session.user as any)?.username}
                </span>
              </h1>
              <p className="text-white/80 font-light text-lg">
                Manage your audio collection with ease
              </p>
            </motion.div>

            <AudioLibrary
              audioFiles={audioFiles}
              onDelete={handleDeleteAudio}
              onUploadClick={onOpen}
            />
          </div>
        </div>
      </div>

      <UploadAudioModal
        open={isOpen}
        onOpenChange={onOpenChange}
        onUploadComplete={() => {
          fetchAudioFiles();
          onOpenChange(false);
        }}
      />
    </Layout>
  );
}
