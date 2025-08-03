import { useState } from "react";
import { useContentsByUser } from "../../utils/hooks";
import { VideoPlayer } from "../Home/VideoPlayer";
import type { ContentItem } from "../Home/Home";

interface UserContentsProps {
  userId: string;
}

export const UserContents = ({ userId }: UserContentsProps) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, error } = useContentsByUser(userId, page, limit);

  const contents = data?.data?.contents || [];
  const pagination = data?.data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinnerLoader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading user contents</p>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No contents found for this user</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">User Contents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content: ContentItem, index: number) => (
          <div
            key={content._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <VideoPlayer
              src={content.mediaUrl}
              username={content.user?.fullName || "Unknown User"}
              caption={content.title}
              isMuted={true}
              genre={content.genre?.slug}
              onToggleMute={() => {}}
              isActive={false}
              preload={index < 3}
              numberOfComments={content.commentCount}
              likesCount={content.likeCount}
              videoId={content._id}
              isLiked={content.isLiked}
              video={content}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Content Stats */}
      {pagination && (
        <div className="mt-4 text-center text-gray-600">
          <p>
            Showing {contents.length} of {pagination.total} contents
          </p>
        </div>
      )}
    </div>
  );
};
