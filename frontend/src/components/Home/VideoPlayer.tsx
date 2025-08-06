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
import { useAuth } from "../context/AuthContests";
import { CommentModal } from "./CommentModal";
import ProfilePicture from "../../utils/ProfilePicture";
import { apiRequest } from "../../utils/apiRequest";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENTS_KEY } from "../../utils/hooks";
import type { ContentItem } from "./Home";

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
  isLiked: boolean;
  preload?: boolean;
  numberOfComments?: number;
  likesCount?: number;
  videoId?: string;
  video: ContentItem;
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
  videoId,
  isLiked,
  video,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(likesCount || 0);
  const [liked, setLiked] = useState(isLiked || false);
  const { showUploadModal } = useAuth();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { user } = useAuth();

  const queryClient = useQueryClient();
  useEffect(() => {
    const isLiked = video?.likes?.some(
      (like) => String(like.user) == String(user?._id)
    );
    setLikes(likesCount || 0);
    setLiked(isLiked);
  }, [likesCount, video, user, isLiked]);

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

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
        if (isActive && !showUploadModal) {
          console.log(`Starting playback for video: ${src}`);

          // For autoplay to work, we need to start muted initially
          // Then unmute after user interaction
          const shouldStartMuted = !window.hasInteracted;
          video.muted = shouldStartMuted;
          console.log(
            `Set video muted to: ${shouldStartMuted} (autoplay strategy)`
          );

          try {
            console.log(`Attempting to play video: ${src}`);
            await video.play();
            console.log(`Successfully started playing: ${src}`);
            setIsPlaying(true);

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
          console.log(`Pausing video: ${src} (inactive or upload modal shown)`);
          video.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error("Playback error:", error);
        setIsPlaying(false);
      }
    };

    handlePlayback();
  }, [isActive, src, isMuted, showUploadModal]);

  // Handle upload modal state changes
  useEffect(() => {
    const video = videoRef.current;
    if (video && showUploadModal) {
      console.log(`Pausing video due to upload modal: ${src}`);
      video.pause();
      setIsPlaying(false);
    }
  }, [showUploadModal, src]);

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

  const handleLike = async () => {
    setLiked((prevLiked) => {
      const newLiked = !prevLiked;
      setLikes((prevLikes) => {
        const newLikes = newLiked ? prevLikes + 1 : prevLikes - 1;
        return newLikes;
      });
      return newLiked;
    });

    try {
      await apiRequest({
        method: "POST",
        path: "/likes/toggle",
        data: { contentId: videoId, type: "content" },
      });
      queryClient.invalidateQueries({
        queryKey: [CONTENTS_KEY],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
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
          <ProfilePicture
            image={video?.user?.profilePicture ?? ""}
            username={video?.user?.fullName ?? ""}
          />
          <button
            onClick={handleLike}
            className={`flex flex-col items-center ${
              liked ? "text-pink-500" : "hover:text-pink-500"
            } transition`}
          >
            <FaHeart className="text-xl" />
            <span className="text-xs mt-1">{likes}</span>
          </button>
          <button
            onClick={openCommentModal}
            className="flex flex-col items-center hover:text-[#7A5AF8] transition"
          >
            <FaCommentDots className="text-xl" />
            <span className="text-xs mt-1">{numberOfComments}</span>
          </button>
          <button className="flex flex-col items-center hover:text-[#7A5AF8] transition">
            <FaShare className="text-xl" />
            <span className="text-xs mt-1">Share</span>
          </button>
        </div>
      </div>

      {videoId && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={closeCommentModal}
          videoId={videoId}
          videoTitle={caption}
          username={username}
          video={video}
        />
      )}
    </div>
  );
};
