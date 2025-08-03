import React, { useState } from "react";
import MenuBar from "./MenuBar";
import SignIn from "../SignInOrSignUp/SignIn";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const [openSignIn, setOpenSignIn] = useState(false);
  return (
    <div className="flex min-h-screen overflow-hidden">
      <MenuBar openModal={() => setOpenSignIn(true)} />
      <SignIn isOpen={openSignIn} onClose={() => setOpenSignIn(false)} />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default PageLayout;
