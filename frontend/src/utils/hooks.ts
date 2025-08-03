import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiRequest";

export const USER_DETAILS = "user-details";
export const USERS_KEY = "users";
export const GENRE_KEY = "genres";
export const CONTENTS_KEY = "contents";
export const CONTENTS_COMMENTS_KEY = "content_comments";

export const useUser = () => {
  return useQuery({
    queryFn: () =>
      apiRequest({
        method: "GET",
        path: "/user/userProfile",
      }),
    queryKey: [USER_DETAILS],
  });
};

export const useGenre = () => {
  return useQuery({
    queryFn: () =>
      apiRequest({
        method: "GET",
        path: "/genres",
      }),
    queryKey: [GENRE_KEY],
  });
};

export const useContents = () => {
  return useQuery({
    queryFn: () =>
      apiRequest({
        method: "GET",
        path: "/content",
      }),
    queryKey: [CONTENTS_KEY],
  });
};

export const useContentComments = (contentId: string) => {
  return useQuery({
    queryFn: () =>
      apiRequest({
        method: "GET",
        path: `/comments/content/${contentId}`,
      }),
    queryKey: [CONTENTS_COMMENTS_KEY, contentId],
  });
};

export const useContentsByUser = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryFn: () =>
      apiRequest({
        method: "GET",
        path: `/content/user/${userId}?page=${page}&limit=${limit}`,
      }),
    queryKey: [CONTENTS_KEY, "user", userId, page, limit],
    enabled: !!userId,
  });
};
