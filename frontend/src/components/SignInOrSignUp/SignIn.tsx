/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-irregular-whitespace */
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import SignUp from "./SignUp";
import { FcGoogle } from "react-icons/fc";
import { apiRequest } from "../../utils/apiRequest";
import { USER_DETAILS } from "../../utils/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignIn: React.FC<SignInProps> = ({ isOpen, onClose }) => {
  const [openSignUp, setOpenSignUp] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
  });

  const queryClient = useQueryClient();

  const handleSubmit = async (values: any, { setFieldError }: any) => {
    try {
      const request = await apiRequest({
        method: "POST",
        path: "/auth/login",
        data: values,
      });
      localStorage.setItem("token", request.user.token);
      queryClient.invalidateQueries({ queryKey: [USER_DETAILS] });
      onClose();
    } catch (error: any) {
      if (error.message.includes("user")) {
        setFieldError("email", error.message);
      }
      if (error.message.includes("password")) {
        setFieldError("password", error.message);
      }
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[483px] p-6 bg-white rounded-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-end justify-end">
              <div
                onClick={onClose}
                className="bg-[#EEEEEE] hover:bg-[#EEEEEE]/60 hover:cursor-pointer transition duration-200 rounded-full size-10 flex items-center justify-center"
              >
                <CgClose size={28} />
              </div>
            </div>
            {openSignUp ? (
              <SignUp
                onClose={onClose}
                openSignIn={() => setOpenSignUp(false)}
              />
            ) : (
              <div className="">
                <h2 className="text-[32px] font-semibold mt-3 pb-6 text-center">
                  Login to Gidshare
                </h2>

                <div className="px-10">
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className="mt-1 w-full p-2 border border-[#C4C4C4] rounded"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium">
                            Password
                          </label>
                          <Field
                            type="password"
                            name="password"
                            className="mt-1 w-full p-2 border border-[#C4C4C4] rounded"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div className="flex gap-2 items-start">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            className="mt-1"
                          />
                          <span className="text-xs">
                            By continuing, you agree to Gidshare Terms of
                            Service and confirm that you have read
                            Gidshare Privacy Policy.
                          </span>
                        </div>
                        {isSubmitting ? (
                          <div className="flex h-10 w-rull items-center justify-center">
                            <span className="loader_spinner"></span>
                          </div>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-2.5 w-full hover:cursor-pointer hover:bg-[#7a5af8]/60 transition duration-200 rounded-[16px] bg-[#7A5AF8] text-white font-semibold"
                          >
                            Login
                          </button>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
                <div className="flex flex-col py-4 gap-2 px-10">
                  <div className="w-full flex gap-2 items-center">
                    <div className="h-0.5 bg-[#eeeeee] w-full" />
                    <span className="text-xs text-gray-500">Or</span>
                    <div className="h-0.5 bg-[#eeeeee] w-full" />
                  </div>
                  <div className="w-full bg-[#C4C4C4]/10 hover:cursor-pointer h-10 rounded-lg  border border-[#eeeeee] flex items-center px-4 gap-6">
                    <FcGoogle size={24} />

                    <span className="text-sm">Continue with Google</span>
                  </div>
                  <div className="items-center pt-4 text-sm flex justify-center">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => setOpenSignUp(true)}
                      className="text-[#7a5af8] pl-0.5 cursor-pointer"
                    >
                      Sign up
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SignIn;
