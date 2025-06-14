"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UploadAudioModal from "@/components/widgets/UploadAudioModal";
import { motion } from "framer-motion";
import "../../styles/glass.css";
import LiquidGlass from "liquid-glass-react";
import { MusicIcon, UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/widgets/Layout";
import NavigationBar from "../../components/widgets/NavigationBar";
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
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"
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
              <p className="text-gray-600 font-medium">
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
    <Layout
      backgroundType="blue"
      backgroundImage="/black-white.jpeg"
      useGradient={true}
    >
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back,{" "}
                {session.user?.name || (session.user as any)?.username}
              </h1>
              <p className="text-gray-600 font-medium">
                Manage your audio collection with ease
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <motion.div
                className="col-span-1 xl:col-span-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <LiquidGlass
                  displacementScale={64}
                  blurAmount={0.1}
                  saturation={130}
                  aberrationIntensity={2}
                  elasticity={0.35}
                  cornerRadius={100}
                  padding="8px 16px"
                  onClick={() => console.log("Button clicked!")}
                >
                  <span className="text-white font-medium">Click Me</span>
                </LiquidGlass>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                  <div className="p-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          Your Audio Library
                        </h2>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {audioFiles.length} files
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={onOpen}
                      >
                        <UploadIcon className="w-4 h-4 mr-2" /> Upload
                      </Button>
                    </div>
                  </div>
                  <AudioLibrary
                    audioFiles={audioFiles}
                    onDelete={handleDeleteAudio}
                  />
                </div>
              </motion.div>
            </div>
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
