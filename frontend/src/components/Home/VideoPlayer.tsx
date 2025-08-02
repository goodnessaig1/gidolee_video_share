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
}: {
  src: string;
  username: string;
  genre: string;
  caption: string;
  isMuted: boolean;
  onToggleMute: () => void;
  isActive: boolean;
  preload: boolean;
  numberOfComments: number;
  likesCount: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(likesCount);

  // Reset playing state when video becomes inactive
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Handle play/pause when active state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log(
      `Video ${src} - isActive: ${isActive}, isPlaying: ${isPlaying}, isMuted: ${isMuted}`
    );

    const handlePlayback = async () => {
      try {
        if (isActive) {
          console.log(`Starting playback for video: ${src}`);

          // Set mute state first
          video.muted = isMuted;

          // Always try to play immediately, then handle loading if needed
          try {
            await video.play();
            setIsPlaying(true);
          } catch {
            console.log("Initial play failed, loading video first");
            // If initial play fails, load the video and try again
            if (video.readyState < 2) {
              // HAVE_CURRENT_DATA
              video.load();
              await new Promise((resolve) => {
                const handleCanPlay = () => {
                  video.removeEventListener("canplay", handleCanPlay);
                  resolve(true);
                };
                video.addEventListener("canplay", handleCanPlay);
              });
            }

            await video.play();
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
    setLikes((prev) => prev + 1);
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
