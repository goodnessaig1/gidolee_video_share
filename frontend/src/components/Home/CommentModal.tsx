/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FaTimes, FaHeart, FaReply, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../utils/apiRequest";
import {
  CONTENTS_COMMENTS_KEY,
  CONTENTS_KEY,
  useContentComments,
} from "../../utils/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  username: string;
}

export const CommentModal = ({
  isOpen,
  onClose,
  videoId,
  videoTitle,
  username,
}: CommentModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useContentComments(videoId);
  const commentsData = data?.data?.comments ?? [];
  const queryClient = useQueryClient();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await apiRequest({
        method: "POST",
        path: "/comments",
        data: { text: newComment, content: videoId },
      });
      queryClient.invalidateQueries({
        queryKey: [CONTENTS_COMMENTS_KEY, videoId],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTENTS_KEY],
      });

      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">📹</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{videoTitle}</h3>
                  <p className="text-xs text-gray-500">@{username}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="spinnerLoader"></div>
                </div>
              ) : commentsData?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No comments yet</p>
                  <p className="text-sm">Be the first to comment!</p>
                </div>
              ) : (
                commentsData &&
                commentsData.map((comment: any) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.user.profilePicture}
                      alt={comment.user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.user.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4">
                        <button
                          // onClick={() => handleLikeComment(comment._id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.isLiked ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          <FaHeart size={12} />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                          <FaReply size={12} />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane size={14} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
