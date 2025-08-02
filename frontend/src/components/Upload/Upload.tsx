import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiX, FiVideo, FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { CONTENTS_KEY, useGenre } from "../../utils/hooks";
import { apiRequest } from "../../utils/apiRequest";
import { useQueryClient } from "@tanstack/react-query";

type VideoUploadModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

interface FormValues {
  videoFile: File | null;
  title: string;
  genre: string;
}

const VideoUploadModal = ({ onClose, isOpen }: VideoUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const { data: genreData, isLoading: genreLoading } = useGenre();
  const genres = genreData?.data?.genres || [];
  const [genreId, setGenreId] = useState("");
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    videoFile: Yup.mixed()
      .required("Video file is required")
      .test("fileSize", "File too large (max 50MB)", (value) => {
        if (!value) return true;
        return (value as File).size <= 50 * 1024 * 1024;
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["video/mp4", "video/quicktime", "video/x-msvideo"].includes(
          (value as File).type
        );
      }),
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title must be 100 characters or less"),
    genre: Yup.string().required("Genre is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (!values.videoFile) return;
    // console.log(values);
    const formData = new FormData();
    formData.append("mediaUrl", values.videoFile);

    formData.append("genre", genreId);
    formData.append("title", values.title);
    // setIsUploading(true);
    try {
      // await onUpload(values.videoFile, values.title, values.genre);
      // onClose();
      const request = await apiRequest({
        method: "POST",
        path: "/content",
        data: formData,
      });
      queryClient.invalidateQueries({ queryKey: [CONTENTS_KEY] });

      console.log(request);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setSubmitting(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File | null) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("videoFile", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
            <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-semibold">Gidshare</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <Formik
                initialValues={{
                  videoFile: null as File | null,
                  title: "",
                  genre: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="p-4">
                    <div className="mb-4">
                      {/* <label className="block text-sm font-medium mb-2">
                        Caption
                      </label> */}
                      <Field
                        name="title"
                        type="text"
                        placeholder="Write a caption..."
                        className="border-none h-12 px-4 bg-[#F6F7F7] outline-none w-full rounded"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Genre
                      </label>
                      <div className="relative">
                        <div
                          className="border-none h-12 px-4 bg-[#F6F7F7] outline-none w-full rounded flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            setShowGenreDropdown(!showGenreDropdown)
                          }
                        >
                          <span
                            className={
                              values.genre ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {values.genre || "Select a genre"}
                          </span>
                          <FiChevronDown
                            size={20}
                            className={`transition-transform ${
                              showGenreDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {showGenreDropdown && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                            {genreLoading ? (
                              <div className="p-3 text-center text-gray-500">
                                Loading genres...
                              </div>
                            ) : (
                              genres &&
                              genres.map(
                                (genre: { _id: string; name: string }) => (
                                  <div
                                    key={genre._id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      setFieldValue("genre", genre.name);
                                      setGenreId(genre?._id);
                                      setShowGenreDropdown(false);
                                    }}
                                  >
                                    {genre.name}
                                  </div>
                                )
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <ErrorMessage
                        name="genre"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      {/* <label className="block text-sm font-medium mb-2">
                        Video File
                      </label> */}
                      <div
                        className="mt-1 flex justify-center h-[280px] flex items-center justify-center px-6 pt-5 pb-6 bg-[#F6F7F7] rounded-md cursor-pointer"
                        onClick={() => {
                          if (!previewUrl) {
                            document.getElementById("videoFile")?.click();
                          }
                        }}
                      >
                        <div className="space-y-1 text-center">
                          {previewUrl ? (
                            <div className="relative">
                              <video
                                src={previewUrl}
                                className="max-h-60 mx-auto rounded-md"
                                controls
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFieldValue("videoFile", null);
                                  setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <FiVideo className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="videoFile"
                                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="videoFile"
                                    name="videoFile"
                                    type="file"
                                    className="sr-only"
                                    accept="video/mp4,video/quicktime,video/x-msvideo"
                                    onChange={(e) =>
                                      handleFileChange(e, setFieldValue)
                                    }
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                MP4, MOV, AVI up to 50MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <ErrorMessage
                        name="videoFile"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {isSubmitting ? (
                      <div className="flex h-10 w-full items-center justify-center">
                        <span className="loader_spinner"></span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="px-10 py-2.5 w-full hover:cursor-pointer hover:bg-[#7a5af8]/60 transition duration-200 rounded-[16px] bg-[#7A5AF8] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Upload
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VideoUploadModal;
