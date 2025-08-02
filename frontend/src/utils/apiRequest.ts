/* eslint-disable @typescript-eslint/no-explicit-any */
export const BaseURL: string = `${import.meta.env.VITE_BASE_URL}`;

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestOptions {
  method: HTTPMethod;
  path: string;
  data?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T = any>({
  method,
  path,
  data,
  headers = defaultHeaders,
}: ApiRequestOptions): Promise<T> {
  try {
    const isFormData = data instanceof FormData;

    const url = `${BaseURL}${path}`;
    const config: RequestInit = {
      method,
      body:
        method === "GET"
          ? undefined
          : isFormData
          ? (data as BodyInit)
          : JSON.stringify(data),
      headers: {
        ...(isFormData ? {} : { ...headers }),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      } as HeadersInit,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "An error occurred");
    }

    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred");
  }
}
