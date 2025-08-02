import Logo from "../../assets/logo.svg";
import { NavLink } from "react-router";
import { IoMdHome } from "react-icons/io";
import { MdOutlineAddBox, MdOutlineExplore } from "react-icons/md";
import { LiaUserCircle, LiaUserPlusSolid } from "react-icons/lia";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../context/AuthContests";
import VideoUploadModal from "../Upload/Upload";
import ProfilePicture from "../../utils/ProfilePicture";

const MenuBar = ({ openModal }: { openModal: () => void }) => {
  const { user, showUploadModal, setShowUploadModal } = useAuth();

  return (
    <>
      {showUploadModal && (
        <VideoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
        />
      )}
      <div className="fixed py-[42px] h-screen w-[240px] px-8 flex flex flex-col gap-[100px]">
        <img src={Logo} alt="" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-1 h-10 bg-[#7A5AF8] w-full text-white gap-4 rounded-md flex items-center font-semibold"
                  : "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <IoMdHome size={24} />
              <span className="">For You</span>
            </NavLink>
            <div
              className={
                "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <MdOutlineExplore size={24} />
              <span className="">Explore</span>
            </div>
            <div
              className={
                "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
              onClick={() => setShowUploadModal(true)}
            >
              <MdOutlineAddBox size={24} />
              <span className="">Upload</span>
            </div>
            <div
              className={
                "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <LiaUserPlusSolid size={24} />

              <span className="">Following</span>
            </div>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "px-1 h-10 bg-[#7A5AF8] w-full text-white gap-4 rounded-md flex items-center font-semibold"
                  : "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <LiaUserCircle size={24} />

              <span className="">Profile</span>
            </NavLink>
            {user && (
              <div className="cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:text-gray-400 hover:bg-[#eeeeee]/40 cursor-pointer rounded-md transition duration-200 font-semibold">
                <BiLogOut size={24} />
                <span className="">Logout</span>
              </div>
            )}
          </div>
          {!user && (
            <div
              onClick={openModal}
              className="px-1 h-10 bg-[#7A5AF8] w-full text-white gap-4 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-[#7A5AF8]/60 font-semibold text-center"
            >
              login
            </div>
          )}
        </div>
        {user && (
          <div className="absolute bottom-0 pb-10">
            <div className="flex flex-row items-center gap-1">
              <div className="rounded-full bg-purple">
                <ProfilePicture
                  image={user?.profilePicture}
                  username={user?.fullName}
                />
              </div>
              <span className="">{user?.fullName?.split(" ")[0]}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuBar;
