'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, DownloadIcon, TrashIcon, MusicIcon, HardDriveIcon, ClockIcon } from 'lucide-react';
import { formatFileSize, formatDate } from '../../utils/common';

interface AudioFile {
  id: number;
  fileName: string;
  description?: string;
  category: { name: string };
  sizeBytes: number;
  uploadedAt: string;
}

interface AudioPlayerProps {
  file: AudioFile;
  onDelete: (id: number) => void;
}

const globalAudioContext = {
  currentPlayingId: null as number | null,
  stopCurrentAudio: () => {}
};

const useAudioPlayer = (file: AudioFile) => {
  const [state, setState] = useState({
    isPlaying: false,
    isLoading: false,
    progress: 0,
    currentTime: '0:00',
    duration: '0:00',
    hasStartedPlaying: false
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => 
    `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

  const updateProgress = () => {
    if (!audioRef.current) return;
    
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    
    if (!isNaN(total) && total > 0) {
      setState(prev => ({
        ...prev,
        progress: (current / total) * 100,
        currentTime: formatTime(current),
        duration: formatTime(total)
      }));
    }
  };

  const startProgressUpdate = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(updateProgress, 100);
  };

  const stopProgressUpdate = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      stopProgressUpdate();
      updateProgress();
    } else {
      // Stop any currently playing audio
      if (globalAudioContext.currentPlayingId && globalAudioContext.currentPlayingId !== file.id) {
        globalAudioContext.stopCurrentAudio();
      }
      
      if (!state.hasStartedPlaying) {
        setState(prev => ({ ...prev, isLoading: true }));
      }
      
      audioRef.current.play().then(() => {
        globalAudioContext.currentPlayingId = file.id;
        setState(prev => ({ 
          ...prev, 
          isPlaying: true, 
          hasStartedPlaying: true, 
          isLoading: false 
        }));
        startProgressUpdate();
      }).catch(err => {
        console.error('Error playing audio:', err);
        setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      play: () => setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isLoading: false, 
        hasStartedPlaying: true 
      })),
      pause: () => setState(prev => ({ ...prev, isPlaying: false })),
      ended: () => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          progress: 0, 
          currentTime: '0:00' 
        }));
        stopProgressUpdate();
        globalAudioContext.currentPlayingId = null;
      },
      loadstart: () => setState(prev => ({ ...prev, isLoading: true })),
      canplay: () => setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        duration: formatTime(audio.duration) 
      })),
      error: () => {
        console.error('Failed to load audio file');
        setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
        stopProgressUpdate();
      },
      loadedmetadata: () => {
        if (!isNaN(audio.duration)) {
          setState(prev => ({ ...prev, duration: formatTime(audio.duration) }));
        }
      }
    };

    // Add all event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
    });

    // Update global audio control
    const originalStopFn = globalAudioContext.stopCurrentAudio;
    globalAudioContext.stopCurrentAudio = () => {
      originalStopFn();
      if (audio && state.isPlaying) {
        audio.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
        stopProgressUpdate();
      }
    };

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        audio.removeEventListener(event, handler);
      });
      
      stopProgressUpdate();
      globalAudioContext.stopCurrentAudio = originalStopFn;
      
      if (globalAudioContext.currentPlayingId === file.id) {
        globalAudioContext.currentPlayingId = null;
      }
    };
  }, [file.id, state.isPlaying]);

  useEffect(() => {
    setState({
      isPlaying: false,
      isLoading: false,
      progress: 0,
      currentTime: '0:00',
      duration: '0:00',
      hasStartedPlaying: false
    });
    
    stopProgressUpdate();
    
    if (globalAudioContext.currentPlayingId === file.id) {
      globalAudioContext.currentPlayingId = null;
    }
  }, [file.id]);

  return {
    audioRef,
    ...state,
    toggleAudio,
    audioUrl: `/api/audio/${file.id}`,
    downloadUrl: `/api/audio/${file.id}?download=true`
  };
};

const AudioPlayer = ({ file, onDelete }: AudioPlayerProps) => {
  const {
    audioRef,
    isPlaying,
    isLoading,
    progress,
    currentTime,
    duration,
    hasStartedPlaying,
    toggleAudio,
    audioUrl,
    downloadUrl
  } = useAudioPlayer(file);

  const handleDownload = () => window.open(downloadUrl, '_blank');
  const handleDelete =  () => onDelete(file.id)
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MusicIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{file.fileName}</h3>
                {file.description && <p className="text-gray-600 text-sm truncate">{file.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                {file.category.name}
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <HardDriveIcon className="w-3 h-3" />
                <span>{formatFileSize(file.sizeBytes)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <ClockIcon className="w-3 h-3" />
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              className={`p-2 rounded-full ${
                isPlaying 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              } transition-all duration-150 relative`}
              onClick={toggleAudio}
              title={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <>
                  <PauseIcon className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </>
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </button>
            <button
              className="p-2 rounded-full bg-green-50 hover:bg-green-100 transition-colors duration-150 text-green-600"
              onClick={handleDownload}
              title="Download"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
            {handleDelete && (
              <button
                className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-150 text-red-600"
                onClick={handleDelete}
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {(isPlaying || isLoading || (hasStartedPlaying && !isPlaying)) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                {isLoading ? (
                  <div className="h-full bg-blue-200 w-1/4 animate-pulse rounded-full"></div>
                ) : (
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium w-20 text-right">
                {isLoading ? "Loading..." : `${currentTime} / ${duration}`}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {isPlaying ? "Playing" : (isLoading ? "Loading..." : "Paused")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer; 