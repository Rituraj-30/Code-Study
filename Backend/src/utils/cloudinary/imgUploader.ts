
import { v2 as cloudinary } from "cloudinary";

interface UploadOptions {
  resource_type?: "image" | "video" | "raw" | "auto";
  folder?: string; 
}

interface CloudinaryUploadResponse {
  success: boolean;
  secure_url: string;
  public_id: string;
  duration: number | string;
}

export const uploadToCloudinary = async (
  file: any,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> => {
  try {
    const path = file.tempFilePath || file;

    // Extension check karo
    const isPDF = file.name?.toLowerCase().endsWith('.pdf') || path.toLowerCase().endsWith('.pdf');

    const finalOptions: any = {
      folder: options.folder 
        ? `${process.env.FOLDER_NAME}/${options.folder}` 
        : process.env.FOLDER_NAME,
      // FORCE PDF to RAW: Agar PDF hai toh 'raw' hi jayega
      resource_type: isPDF ? "raw" : (options.resource_type || "auto"),
    };

    const result = await cloudinary.uploader.upload(path, finalOptions);

    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration || 0,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};
export const deleteResourceFromCloudinary = async (
  fileUrl: string,
  resourceType: "image" | "video" = "image" 
): Promise<any> => {
  if (!fileUrl) return;

  try {
  
    const parts = fileUrl.split("/");
    const fileNameWithExtension = parts[parts.length - 1]; 
    const publicIdWithFolders = fileUrl
      .split("/")
      .slice(fileUrl.split("/").indexOf("upload") + 2) 
      .join("/")
      .replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicIdWithFolders, {
      resource_type: resourceType,
    });

    // console.log(`Cloudinary deleted (${resourceType}): ${publicIdWithFolders}`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
