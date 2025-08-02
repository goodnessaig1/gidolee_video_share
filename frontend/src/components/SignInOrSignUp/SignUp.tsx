/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-irregular-whitespace */
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { apiRequest } from "../../utils/apiRequest";

interface SignUpProps {
  onClose: () => void;
  openSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ openSignIn }) => {
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", values.profilePicture);
      formData.append("fullName", values?.fullName);
      formData.append("email", values?.email);
      formData.append("password", values?.password);

      const request = await apiRequest({
        method: "POST",
        path: "/login",
        data: values,
      });
      console.log(request);
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
          initialValues={{ fullName: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3 w-full hover:cursor-pointer hover:bg-[#7a5af8]/60 transition duration-200 rounded-[16px] bg-[#7A5AF8] text-white font-semibold"
                // className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
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
