import PageLayout from "../common/PageLayout";
import { useAuth } from "../context/AuthContests";
import { UserVideos } from "./UserVideos";

const Profile = () => {
  const { user } = useAuth();

  const handleAddNew = () => {
    // Handle opening upload modal or navigating to upload page
    console.log("Add new video clicked");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="pl-16 pr-10 md:pl-[260px] pt-[120px]">
        <div className="flex md:items-center gap-6 mb-8 flex-col md:flex-row">
          <div className="size-20 md:size-24 bg-gray-200 rounded-full flex items-center justify-center">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-600">
                {user.fullName?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <span className="text- font-bold">{user.fullName}</span>
            <p className="text-gray-600">@{user.email}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* User Videos */}
        {user?.role !== "user" && (
          <UserVideos userId={user._id} onAddNew={handleAddNew} />
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;
