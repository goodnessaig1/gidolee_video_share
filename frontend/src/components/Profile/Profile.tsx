import PageLayout from "../common/PageLayout";
import ProfileImg from "../../assets/profile.svg";

const Profile = () => {
  return (
    <PageLayout>
      <div className="pt-20 ml-[243px] px-16 flex flex-col gap-8">
        <div className="flex flex-row gap-9">
          {/* <div className="rounded-full size-[100px] flex items-center justify-center bg-[#7a5af8] text-white">
            <IoAddSharp size={52} />
          </div> */}
          <img src={ProfileImg} alt="" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2">
                <span className="text-[24px] font-semibold">Dannymain</span>
                <span className="text-[24px] text-[#747474]">@dannymain</span>
              </div>
              <div className="flex items-center justify-center hover:cursor-pointer bg-[#7A5AF8] w-[104px] h-10 rounded-md text-white hover:bg-[#7A5AF8]/60">
                Edit profile
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-semibold">120</span>
                  <span className="text-[24px] text-[#747474]">Following</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-semibold">500</span>
                  <span className="text-[24px] text-[#747474]">Followers</span>
                </div>
              </div>
            </div>
            <span className="">Explorer, traveller and a good cook</span>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col ">
            <span className="border-b w-[140px] pl-6">Videos</span>
            <div className="h-0.5 w-full bg-[#0000004D]"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
