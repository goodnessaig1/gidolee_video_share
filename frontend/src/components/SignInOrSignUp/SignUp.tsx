/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-irregular-whitespace */
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { apiRequest } from "../../utils/apiRequest";
import { LuImagePlus } from "react-icons/lu";
import { FiX } from "react-icons/fi";
import { MdSystemSecurityUpdateGood } from "react-icons/md";

interface SignUpProps {
  onClose: () => void;
  openSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ openSignIn }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        openSignIn();
      }, 2400);
    }
  }, [success, openSignIn]);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    profilePicture: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported file type", (value) => {
        return (
          value &&
          ["image/jpeg", "image/png", "image/svg", "image/jpg"].includes(
            (value as File).type
          )
        );
      }),
  });

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", values.profilePicture);
      formData.append("fullName", values?.fullName);
      formData.append("email", values?.email);
      formData.append("password", values?.password);

      await apiRequest({
        method: "POST",
        path: "/auth/register",
        data: formData,
      });
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <h2 className="text-[32px] font-semibold mt-3 pb-6 text-center">
        Sign to Gidshare
      </h2>
      <div className="px-10">
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            profilePicture: null as File | null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    console.log(file);
                    setFieldValue("profilePicture", file);
                    setPreview(URL.createObjectURL(file));
                    event.stopPropagation();
                  }
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="hover:bg-[#7a5af8]/5 transition duration-200 hover:cursor-pointer size-12 rounded-full border border-[#7a5af8] border-dotted flex items-center justify-center"
              >
                {preview ? (
                  <div className="">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFieldValue("profilePicture", null);
                        setPreview(null);
                      }}
                      className="absolute -mt-4 ml-6 bg-black/40 hover:cursor-pointer bg-opacity-50 text-white p-1 rounded-full"
                    >
                      <FiX size={16} />
                    </button>
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-full object-cover size-11"
                    />
                  </div>
                ) : (
                  <LuImagePlus color="#7a5af8" size={24} />
                )}
              </div>

              <ErrorMessage
                name="profilePicture"
                component="div"
                className="text-red-500 text-xs mt-1"
              />

              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  className="mt-1 w-full p-2 border border-[#C4C4C4] rounded"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
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
                <label className="block text-sm font-medium">Password</label>
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
                <input type="checkbox" name="" id="" className="mt-1" />
                <span className="text-xs">
                  By continuing, you agree to Gidshare Terms of Service and
                  confirm that you have read Gidshare Privacy Policy.
                </span>
              </div>
              {success ? (
                <div className="flex h-10 w-rull items-center justify-center">
                  <MdSystemSecurityUpdateGood size={28} color="#7a5af8" />
                </div>
              ) : isSubmitting ? (
                <div className="flex h-10 w-rull items-center justify-center">
                  <span className="loader_spinner"></span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3 w-full hover:cursor-pointer hover:bg-[#7a5af8]/60 transition duration-200 rounded-[16px] bg-[#7A5AF8] text-white font-semibold"
                >
                  {isSubmitting ? "Registering..." : "Register"}
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
          Already have an account?{" "}
          <span
            onClick={openSignIn}
            className="text-[#7a5af8] pl-0.5 cursor-pointer"
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
