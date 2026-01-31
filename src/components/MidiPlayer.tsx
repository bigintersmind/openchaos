"use client";

import { useRef, useEffect, useState } from "react";

interface MidiPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MidiPlayer({ isOpen, onClose }: MidiPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Reset playing state when audio ends
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => audio.removeEventListener("ended", handleEnded);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="midi-player-container">
      <div className="midi-player-header">
        <span className="midi-player-header-text">
          Music Player
        </span>
      </div>
      <div className="midi-player-display">
        <div className="midi-player-display-text">
          {isPlaying ? (
            <span>▶ Now Playing...</span>
          ) : (
            <span>⏸ Ready</span>
          )}
        </div>
        <div className="midi-player-filename">
          openchaos.mid
        </div>
      </div>
      <div className="midi-player-controls">
        <button
          onClick={togglePlay}
          className="midi-player-control-button"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={stopMusic}
          className="midi-player-control-button"
        >
          ⏹ Stop
        </button>
        <button
          onClick={() => {
            stopMusic();
            onClose();
          }}
          className="midi-player-close-button"
        >
          Close
        </button>
      </div>
      <audio ref={audioRef} src="/openchaos.mp3" loop />
    </div>
  );
}
