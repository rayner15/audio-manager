'use client';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UploadAudioModal from '@/components/widgets/UploadAudioModal';
import { motion } from 'framer-motion';
import {
  LogOutIcon,
  MusicIcon,
  SettingsIcon,
  UploadIcon,
  UserIcon
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../../components/widgets/Layout';
import AudioPlayer from '../../components/widgets/AudioPlayer';

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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAudioFiles();
    }
  }, [session]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const profileButton = document.getElementById('profile-button');
      
      if (profileDropdownOpen && 
          dropdown && !dropdown.contains(event.target as Node) && 
          profileButton && !profileButton.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [profileDropdownOpen]);
  
  const handleDeleteAudio = async (fileId: number) => {
    if (confirm('Are you sure you want to delete this audio file?')) {
      try {
        const response = await fetch(`/api/audio/${fileId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchAudioFiles();
        } else {
          alert('Failed to delete audio file');
        }
      } catch (error) {
        console.error('Error deleting audio file:', error);
        alert('An error occurred while deleting the audio file');
      }
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch('/api/audio');
      if (response.ok) {
        const data = await response.json();
        setAudioFiles(data.audioFiles);
      }
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };



  if (status === 'loading') {
    return (
      <Layout backgroundType="blue">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <MusicIcon className="w-10 h-10 text-white" />
            </motion.div>
            <div className="w-64 mb-4">
              <Progress className="h-2" value={90} />
            </div>
            <p className="text-gray-600 font-medium">Loading your audio hub...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout backgroundType="blue">
      <div className="sticky top-0 z-50 w-full">
        <div className="backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MusicIcon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Audio Hub
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Professional</p>
                </div>
              </div>
              <div className="relative">
                <motion.button
                  id="profile-button"
                  className="flex items-center focus:outline-none relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md transition-all duration-200 hover:shadow-lg">
                    {session.user?.name?.[0] || (session.user as any)?.username?.[0] || 'U'}
                  </div>
                  {profileDropdownOpen && (
                    <motion.span 
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>

                <div 
                  id="user-dropdown" 
                  className={`${profileDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} absolute right-0 mt-2 w-56 rounded-xl bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200 overflow-hidden z-50 transition-all duration-200 ease-in-out`}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-medium text-blue-600">{(session.user as any)?.username || session.user?.name}</p>
                  </div>
                  <div className="p-2">
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 ease-in-out">
                      <UserIcon className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 ease-in-out">
                      <SettingsIcon className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <button 
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 ease-in-out"
                      onClick={() => signOut()}
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Welcome Section */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || (session.user as any)?.username}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
              <div className="p-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Your Audio Library</h2>
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
              <div className="p-6">
                {audioFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MusicIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No audio files yet</h3>
                    <p className="text-gray-600 mb-8">Upload your first audio file to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {audioFiles.map((file) => (
                      <AudioPlayer 
                        key={file.id}
                        file={file}
                        onDelete={handleDeleteAudio}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
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