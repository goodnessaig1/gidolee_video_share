import { useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaCommentDots,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaPause,
  FaPlay,
} from "react-icons/fa";

// Extend Window interface to include hasInteracted
declare global {
  interface Window {
    hasInteracted: boolean;
  }
}

interface VideoPlayerProps {
  src: string;
  username: string;
  caption: string;
  isMuted: boolean;
  genre?: string;
  onToggleMute: () => void;
  isActive: boolean;
  preload?: boolean;
  numberOfComments?: number;
  likesCount?: number;
}

export const VideoPlayer = ({
  src,
  username,
  caption,
  isMuted,
  onToggleMute,
  isActive,
  preload,
  genre,
  numberOfComments,
  likesCount,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(likesCount || 0);

  // Reset playing state when video becomes inactive
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Handle play/pause when active state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log(`Video ${src} - No video element found`);
      return;
    }

    console.log(
      `Video ${src} - isActive: ${isActive}, isPlaying: ${isPlaying}, isMuted: ${isMuted}, readyState: ${video.readyState}`
    );

    const handlePlayback = async () => {
      try {
        if (isActive) {
          console.log(`Starting playback for video: ${src}`);

          // For autoplay to work, we need to start muted initially
          // Then unmute after user interaction
          const shouldStartMuted = !window.hasInteracted;
          video.muted = shouldStartMuted;
          console.log(
            `Set video muted to: ${shouldStartMuted} (autoplay strategy)`
          );

          // Always try to play immediately, then handle loading if needed
          try {
            console.log(`Attempting to play video: ${src}`);
            await video.play();
            console.log(`Successfully started playing: ${src}`);
            setIsPlaying(true);

            // If we started muted due to autoplay restrictions, unmute after a short delay
            if (shouldStartMuted && !isMuted) {
              setTimeout(() => {
                if (video && window.hasInteracted) {
                  video.muted = false;
                  console.log(`Unmuted video after autoplay: ${src}`);
                }
              }, 100);
            }
          } catch (playError) {
            console.log(
              "Initial play failed, loading video first. Error:",
              playError
            );
            // If initial play fails, load the video and try again
            if (video.readyState < 2) {
              // HAVE_CURRENT_DATA
              console.log(
                `Loading video: ${src}, readyState: ${video.readyState}`
              );
              video.load();
              await new Promise((resolve) => {
                const handleCanPlay = () => {
                  console.log(`Video can play: ${src}`);
                  video.removeEventListener("canplay", handleCanPlay);
                  resolve(true);
                };
                video.addEventListener("canplay", handleCanPlay);
              });
            }

            console.log(`Retrying play after load: ${src}`);
            await video.play();
            console.log(`Successfully started playing after load: ${src}`);
            setIsPlaying(true);
          }
        } else {
          console.log(`Pausing video: ${src}`);
          video.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error("Playback error:", error);
        setIsPlaying(false);
      }
    };

    handlePlayback();
  }, [isActive, src, isMuted]);

  // Handle mute state changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      console.log(`Video ${src} mute state set to: ${isMuted}`);
    }
  }, [isMuted, src]);

  // Listen to video events to sync state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Preload video metadata if needed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (preload) {
      video.preload = "metadata";
    }
  }, [preload]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        await video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Play error:", error);
    }
  };

  const handleLike = () => {
    setLikes((prev) => (prev || 0) + 1);
  };

  return (
    <div className="flex gap-4 h-full py-4">
      <div className="w-full h-full relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-2xl"
          src={src}
          loop
          muted={isMuted}
          playsInline
          preload={preload ? "metadata" : "none"}
        />

        {/* Video Controls */}
        <div className="absolute bottom-20 left-4 flex gap-2">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>
          <button
            onClick={onToggleMute}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
          </button>
        </div>

        <div className="relative ml-2 -mt-24 text-white pr-4 z-10">
          <h3 className="font-semibold text-sm">@{username}</h3>
          <p className="text-xs">{caption}</p>
          <p className="text-xs text-gray-300">{genre}</p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="space-y-4 text-black">
          <button
            onClick={handleLike}
            className="flex flex-col items-center hover:text-pink-500 transition"
          >
            <FaHeart className="text-xl" />
            <span className="text-xs mt-1">{likes}</span>
          </button>
          <button className="flex flex-col items-center hover:text-blue-400 transition">
            <FaCommentDots className="text-xl" />
            <span className="text-xs mt-1">{numberOfComments}</span>
          </button>
          <button className="flex flex-col items-center hover:text-green-400 transition">
            <FaShare className="text-xl" />
            <span className="text-xs mt-1">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
