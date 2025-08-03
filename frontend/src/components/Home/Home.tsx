import { IoIosArrowDropdownCircle, IoIosArrowDropup } from "react-icons/io";
import { VideoPlayer } from "./VideoPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import PageLayout from "../common/PageLayout";
import flag from "../../assets/flag.svg";
import { useAuth } from "../context/AuthContests";
import { useContents } from "../../utils/hooks";
import ProfilePicture from "../../utils/ProfilePicture";

export interface ContentItem {
  _id: string;
  title: string;
  mediaUrl: string;
  user: {
    _id: string;
    fullName: string;
    profilePicture: string;
  };
  genre: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  likeCount: number;
  shareCount: number;
  isLiked: boolean;
  description: string;
  mediaType: string;
  thumbnail: string | null;
  duration: number | null;
  views: number;
  likes: {
    user: string;
  }[];
  shares: unknown[];
  isPublic: boolean;
  tags: string[];
  location: string | null;
}

const Home = () => {
  const { user } = useAuth();
  const [globalMuted, setGlobalMuted] = useState(false); // Start unmuted
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const { data, isLoading } = useContents();
  const contents = data?.data?.contents || [];

  useEffect(() => {
    if (contents.length > 0 && activeVideo === null) {
      console.log("Setting first video as active");
      setActiveVideo(0);
    }
  }, [contents, activeVideo]);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!window.hasInteracted) {
        console.log("User interaction detected - enabling autoplay with sound");
        window.hasInteracted = true;
      }
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("scroll", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      console.log(
        "Intersection observer triggered with entries:",
        entries.length
      );

      entries.forEach((entry) => {
        const videoIdAttr = entry.target.getAttribute("data-video-id");
        console.log("Entry target:", entry.target, "videoIdAttr:", videoIdAttr);

        if (videoIdAttr) {
          const videoId = parseInt(videoIdAttr, 10);
          console.log("Parsed videoId:", videoId, "isNaN:", isNaN(videoId));

          if (!isNaN(videoId)) {
            console.log(
              `Video ${videoId} intersection: ${entry.intersectionRatio}`
            );

            if (entry.intersectionRatio > 0.5) {
              console.log(
                `Video ${videoId} is now active (${entry.intersectionRatio})`
              );
              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
              }

              animationFrameRef.current = requestAnimationFrame(() => {
                console.log("Setting active video to:", videoId);
                setActiveVideo(videoId);
              });
            } else if (entry.intersectionRatio < 0.3) {
              // Pause videos that are no longer visible
              console.log(
                `Video ${videoId} is no longer visible (${entry.intersectionRatio})`
              );
            }
          }
        }
      });
    },
    []
  );

  useEffect(() => {
    console.log("Setting up intersection observer");
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      rootMargin: "0px 0px -10% 0px",
    });

    console.log("Observing containers:", containerRefs.current.length);
    containerRefs.current.forEach((container, index) => {
      if (container) {
        console.log(`Observing container ${index}:`, container);
        observerRef.current?.observe(container);
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, contents]);

  const toggleGlobalMute = () => {
    setGlobalMuted((prev) => !prev);
  };

  return (
    <PageLayout>
      <div className="pl-16 pr-2 w-full flex justify-center h-screen">
        <div className="max-w-[500px] w-full  h-full overflow-y-auto">
          {isLoading ? (
            <div className="absolute left-0 top-0 h-screen w-full flex items-center justify-center">
              <span className="spinnerLoader"></span>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {contents &&
                contents.map((video: ContentItem, index: number) => (
                  <div
                    key={video._id}
                    ref={(el) => {
                      containerRefs.current[index] = el;
                      if (el && observerRef.current) {
                        console.log(`Observing new container ${index}:`, el);
                        observerRef.current.observe(el);
                      }
                    }}
                    data-video-id={index.toString()}
                  >
                    <VideoPlayer
                      src={video?.mediaUrl}
                      username={video.user?.fullName}
                      caption={video.title}
                      isMuted={globalMuted}
                      genre={video?.genre.slug}
                      onToggleMute={toggleGlobalMute}
                      isActive={activeVideo === index}
                      preload={index < 3}
                      numberOfComments={video.commentCount}
                      likesCount={video.likeCount}
                      videoId={video._id}
                      isLiked={video?.isLiked}
                      video={video}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="fixed right-0 top-0 hidden md:block">
        <div className=" flex gap-4 mt-10 pr-8">
          <div className="flex items-center gap-1">
            <img src={flag} alt="flag" />
            <span className="font-semibold">English</span>
          </div>
          {user ? (
            <div className="flex flex-row items-center gap-2">
              <div className="rounded-full bg-purple">
                <ProfilePicture
                  image={user?.profilePicture}
                  username={user?.fullName}
                />
              </div>
              <div className="flex flex-col">
                <span className="">{user?.fullName?.split(" ")[0]}</span>
                <span className="text-xs">{user?.role}</span>
              </div>
            </div>
          ) : (
            <div className="px-10 py-2 hover:cursor-pointer hover:bg-[#7a5af8]/60 transition duration-200 rounded-[26px] bg-[#7A5AF8] text-white font-semibold">
              Login
            </div>
          )}
        </div>
      </div>
      <div className="fixed hidden w-[200px] top-0 items-center lg:flex h-screen justify-center right-0 ">
        <div className="flex flex-col gap-4">
          <div className="text-[#6E6E6E] hover:cursor-pointer hover:text-[#6E6E6E]/60 transition duration-200">
            <IoIosArrowDropup size={42} />
          </div>
          <div className="text-[#6E6E6E] hover:cursor-pointer hover:text-[#6E6E6E]/60 transition duration-200">
            <IoIosArrowDropdownCircle size={46} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
