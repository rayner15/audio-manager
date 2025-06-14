"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  DownloadIcon,
  TrashIcon,
  MusicIcon,
  HardDriveIcon,
  ClockIcon,
} from "lucide-react";
import { formatFileSize, formatDate } from "../../utils/common";
import { getCategoryColor } from "../../utils/audio";
import GlassCard from "./GlassCard";
import { AudioFile } from "@/interface/audioFile";

interface AudioPlayerProps {
  file: AudioFile;
  onDelete: (id: string) => void;
  allCategories?: { id: string; name: string }[];
}

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  currentTime: string;
  duration: string;
  shouldShow: boolean;
}

const AudioControls = ({
  isPlaying,
  isLoading,
  progress,
  currentTime,
  duration,
  shouldShow,
}: AudioControlsProps) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        shouldShow ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-center">
        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          {isLoading ? (
            <div className="h-full bg-white/40 w-1/4 animate-pulse rounded-full"></div>
          ) : (
            <div
              className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          )}
        </div>
        <div className="text-xs text-white/80 font-medium w-20 text-right">
          {isLoading ? "Loading..." : `${currentTime} / ${duration}`}
        </div>
      </div>
      <div className="mt-2 text-xs text-white/80">
        {isPlaying ? "Playing" : isLoading ? "Loading..." : "Paused"}
      </div>
    </div>
  );
};

const globalAudioContext = {
  currentPlayingId: null as string | null,
  stopCurrentAudio: () => {},
};

const useAudioPlayer = (file: AudioFile) => {
  const [state, setState] = useState({
    isPlaying: false,
    isLoading: false,
    progress: 0,
    currentTime: "0:00",
    duration: "0:00",
    hasStartedPlaying: false,
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string =>
    `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  const updateProgress = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;

    if (!isNaN(total) && total > 0) {
      setState((prev) => ({
        ...prev,
        progress: (current / total) * 100,
        currentTime: formatTime(current),
        duration: formatTime(total),
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
      setState((prev) => ({ ...prev, isPlaying: false }));
      stopProgressUpdate();
      updateProgress();
    } else {
      // Stop any currently playing audio
      if (
        globalAudioContext.currentPlayingId &&
        globalAudioContext.currentPlayingId !== file.id
      ) {
        globalAudioContext.stopCurrentAudio();
      }

      if (!state.hasStartedPlaying) {
        setState((prev) => ({ ...prev, isLoading: true }));
      }

      audioRef.current
        .play()
        .then(() => {
          globalAudioContext.currentPlayingId = file.id;
          setState((prev) => ({
            ...prev,
            isPlaying: true,
            hasStartedPlaying: true,
            isLoading: false,
          }));
          startProgressUpdate();
        })
        .catch((err) => {
          console.error("Error playing audio:", err);
          setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }));
        });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      play: () =>
        setState((prev) => ({
          ...prev,
          isPlaying: true,
          isLoading: false,
          hasStartedPlaying: true,
        })),
      pause: () => setState((prev) => ({ ...prev, isPlaying: false })),
      ended: () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          hasStartedPlaying: false, // Reset hasStartedPlaying when audio ends
          progress: 0,
          currentTime: "0:00",
        }));
        stopProgressUpdate();
        globalAudioContext.currentPlayingId = null;
      },
      loadstart: () => setState((prev) => ({ ...prev, isLoading: true })),
      canplay: () =>
        setState((prev) => ({
          ...prev,
          isLoading: false,
          duration: formatTime(audio.duration),
        })),
      error: () => {
        console.error("Failed to load audio file");
        setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }));
        stopProgressUpdate();
      },
      loadedmetadata: () => {
        if (!isNaN(audio.duration)) {
          setState((prev) => ({
            ...prev,
            duration: formatTime(audio.duration),
          }));
        }
      },
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
        setState((prev) => ({ ...prev, isPlaying: false }));
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
      currentTime: "0:00",
      duration: "0:00",
      hasStartedPlaying: false,
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
    downloadUrl: `/api/audio/${file.id}?download=true`,
  };
};

const AudioPlayer = ({
  file,
  onDelete,
  allCategories = [],
}: AudioPlayerProps) => {
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
    downloadUrl,
  } = useAudioPlayer(file);

  const handleDownload = () => window.open(downloadUrl, "_blank");
  const handleDelete = () => onDelete(file.id);

  const categoryId = file.category.id;

  return (
    <GlassCard className="w-full" style={{ width: "100%" }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
      />
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar">
              <MusicIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate">
                {file.fileName}
              </h3>
              {file.description && (
                <p className="text-white/80 text-sm truncate">
                  {file.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span
              className="px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm text-white"
              style={{
                backgroundColor: getCategoryColor(categoryId, allCategories),
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              {file.category.name}
            </span>
            <div className="flex items-center gap-1 text-white/80">
              <HardDriveIcon className="w-3 h-3" />
              <span>{formatFileSize(file.sizeBytes)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <ClockIcon className="w-3 h-3" />
              <span>{formatDate(file.uploadedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            className={`p-2 rounded-full ${
              isPlaying
                ? "bg-white/30 text-white shadow-md backdrop-blur-md"
                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            } transition-all duration-150 relative border border-white/30`}
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
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-150 text-white backdrop-blur-sm border border-white/30"
            onClick={handleDownload}
            title="Download"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
          {handleDelete && (
            <button
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-150 text-white backdrop-blur-sm border border-white/30"
              onClick={handleDelete}
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <AudioControls
        isPlaying={isPlaying}
        isLoading={isLoading}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        shouldShow={isPlaying || (hasStartedPlaying && !isPlaying)}
      />
    </GlassCard>
  );
};

export default AudioPlayer;
