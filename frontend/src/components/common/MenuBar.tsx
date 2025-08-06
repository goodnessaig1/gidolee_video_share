import Logo from "../../assets/logo.svg";
import LogoMd from "../../../public/gid.svg";
import { NavLink, useNavigate } from "react-router";
import { IoMdHome } from "react-icons/io";
import { MdOutlineAddBox, MdOutlineExplore } from "react-icons/md";
import { LiaUserCircle, LiaUserPlusSolid } from "react-icons/lia";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../context/AuthContests";
import VideoUploadModal from "../Upload/Upload";
import ProfilePicture from "../../utils/ProfilePicture";
import { USER_DETAILS } from "../../utils/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const MenuBar = ({ openModal }: { openModal: () => void }) => {
  const { user, showUploadModal, setShowUploadModal } = useAuth();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await localStorage.removeItem("token");
      await queryClient.invalidateQueries({ queryKey: [USER_DETAILS] });
      await queryClient.setQueryData([USER_DETAILS], null);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <>
      {showUploadModal && (
        <VideoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
        />
      )}
      <div className="fixed py-6 lg:py-[42px] h-screen lg:w-[240px] px-2 lg:px-8 flex flex flex-col gap-20 lg:gap-[100px]">
        <img src={Logo} className="hidden lg:block" alt="" />
        <img src={LogoMd} className="lg:hidden" alt="" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-1 h-10 bg-[#7A5AF8] w-[36px] lg:w-full text-white gap-4 rounded-lg flex items-center font-semibold"
                  : "cursor-pointer h-10 px-1 lg:w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <IoMdHome size={24} />
              <span className="hidden lg:block">For You</span>
            </NavLink>
            <div
              className={
                "cursor-pointer h-10 px-1 lg:w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-md transition duration-200 font-semibold"
              }
            >
              <MdOutlineExplore size={24} />
              <span className="hidden lg:block">Explore</span>
            </div>
            <div
              className={
                "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-lg transition duration-200 font-semibold"
              }
              onClick={() => {
                if (user?.role === "admin" || user?.role === "creator") {
                  setShowUploadModal(true);
                }
              }}
            >
              <MdOutlineAddBox size={24} />
              <span className="hidden lg:block">Upload</span>
            </div>
            <div
              className={
                "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-lg transition duration-200 font-semibold"
              }
            >
              <LiaUserPlusSolid size={24} />

              <span className="hidden lg:block">Following</span>
            </div>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "px-1 h-10 bg-[#7A5AF8] w-[36px] lg:w-full text-white gap-4 rounded-lg flex items-center font-semibold"
                  : "cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:bg-[#7A5AF8]/60 hover:text-white rounded-lg transition duration-200 font-semibold"
              }
            >
              <LiaUserCircle size={24} />

              <span className="hidden lg:block">Profile</span>
            </NavLink>
            {user &&
              (loggingOut ? (
                <div className="flex items-center justify-center w-full">
                  <div className="logout_spinn"></div>
                </div>
              ) : (
                <div
                  onClick={handleLogout}
                  className="cursor-pointer h-10 px-1 w-full flex items-center gap-4 text-[#161823] hover:text-gray-400 hover:bg-[#eeeeee]/40 cursor-pointer rounded-md transition duration-200 font-semibold"
                >
                  <BiLogOut size={24} />
                  <span className="hidden lg:block">Logout</span>
                </div>
              ))}
          </div>
          {!user && (
            <div
              onClick={openModal}
              className="px-1 h-10 bg-[#7A5AF8] w-full text-white gap-4 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-[#7A5AF8]/60 font-semibold text-center"
            >
              <div className="hidden lg:block">login</div>
              <LiaUserCircle className="md:hidden" size={24} />
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
              <span className="hidden lg:block">
                {user?.fullName?.split(" ")[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuBar;
