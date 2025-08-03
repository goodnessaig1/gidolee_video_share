import { useContentsByUser } from "../../utils/hooks";
import { useAuth } from "../context/AuthContests";
import { MdAdd } from "react-icons/md";

interface UserVideosProps {
  userId: string;
  onAddNew?: () => void;
}

interface VideoContent {
  _id: string;
  title: string;
  mediaUrl: string;
  thumbnail?: string;
  mediaType: string;
}

export const UserVideos = ({ userId, onAddNew }: UserVideosProps) => {
  const { data, isLoading } = useContentsByUser(userId, 1, 20);
  const { user, setShowUploadModal } = useAuth();
  const isOwnProfile = user?._id === userId;

  const contents = data?.data?.contents || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="spinnerLoader"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-6">
        <div className="px-4 py-2 border-b-2 border-gray-800 text-gray-800 font-medium">
          Videos
        </div>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>

      <div className="flex flex-wrap gap-4 max-w-[900px] pb-4">
        {contents.map((content: VideoContent) => (
          <div
            key={content._id}
            className="w-48 h-64 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {content.thumbnail ? (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={content.mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              )}
            </div>
            <div className="p-3">
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                {content.mediaType === "video" ? "Video" : "Image"}
              </div>
            </div>
          </div>
        ))}

        {isOwnProfile && (
          <div
            onClick={onAddNew}
            className="w-48 h-64 border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div
              onClick={() => {
                if (user?.role === "admin" || user?.role === "creator") {
                  setShowUploadModal(true);
                }
              }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <MdAdd size={24} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">Add New</p>
            </div>
          </div>
        )}
      </div>

      {contents.length === 0 && !isOwnProfile && (
        <div className="text-center py-8 text-gray-500">
          <p>No videos yet</p>
        </div>
      )}
    </div>
  );
};
