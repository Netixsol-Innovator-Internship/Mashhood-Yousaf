// hooks/useUpload.js
import { useUploadImagesMutation } from "../store/shopCoApi";

export const useUpload = () => {
  const [uploadImages, { isLoading, error }] = useUploadImagesMutation();

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await uploadImages(formData).unwrap();
      return response;
    } catch (err) {
      throw new Error("Upload failed");
    }
  };

  return {
    uploadFiles,
    isLoading,
    error,
  };
};
