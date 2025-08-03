/* eslint-disable react-refresh/only-export-components */
import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";
import { useUser } from "../../utils/hooks";
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null | undefined;
  showUploadModal: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShowUploadModal: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children?: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data } = useUser();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const value: AuthContextType = {
    user: data?.data,
    showUploadModal,
    setShowUploadModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
