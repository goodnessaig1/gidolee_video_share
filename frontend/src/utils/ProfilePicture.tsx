import React from "react";

interface ProfileProps {
  image: string;
  username: string;
}
const ProfilePicture: React.FC<ProfileProps> = ({
  image = "",
  username = "",
}) => {
  return (
    <div>
      {image ? (
        <img src={image} className="size-8 rounded-full object-cover" alt="" />
      ) : (
        <div className="size-8 rounded-full border border-[#7A5AF8]">
          {username.slice(0, 2)}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
