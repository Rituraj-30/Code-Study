import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import { setUser } from "../../redux/slices/profileSlice";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

// 1. Update Profile Image
export function updateDisplayPicture(token: string, formData: FormData) {
  return async (dispatch: any) => {
    const toastId = toast.loading("Uploading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      // console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Display Picture Updated Successfully");
      // Yahan backend 'data' bhej raha hai
      dispatch(setUser(response.data.data));
      localStorage.setItem("user", JSON.stringify(response.data.data));
      
    } catch (error: any) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR:", error);
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}

export function deleteProfile(token: string) {
  return async (dispatch: any) => {
    const toastId = toast.loading("Deleting your account...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Account Deleted Successfully");

      // 1. Redux state saaf karo
      dispatch(setUser(null));
      
      // 2. LocalStorage puri tarah saaf karo
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.clear(); // Extra safety ke liye

      window.location.href = "/"; 
      
    } catch (error: any) {
      console.log("DELETE_PROFILE_API ERROR:", error);
      toast.error(error.response?.data?.message || "Could Not Delete Account");
    }
    toast.dismiss(toastId);
  };
}


// 2. Update Profile Details
export function updateProfile(token: string, formData: any, navigate: any) {
  return async (dispatch: any) => {
    const toastId = toast.loading("Updating...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      console.log("UPDATE_PROFILE_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // --- FIX STARTS HERE ---
      // Backend se updatedUserDetails nahi, 'data' key aa rahi hai
      const updatedUser = response.data.data; 
      
      const userImage = updatedUser.image 
        ? updatedUser.image 
        : `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.firstName} ${updatedUser.lastName}`;
      
      // Redux aur LocalStorage dono mein updatedUser dalo
      dispatch(setUser({ ...updatedUser, image: userImage }));
      localStorage.setItem("user", JSON.stringify({ ...updatedUser, image: userImage }));
      // --- FIX ENDS HERE ---

      toast.success("Profile Updated Successfully");
      navigate("/dashboard/my-profile");
      
    } catch (error: any) {
      console.log("UPDATE_PROFILE_API ERROR:", error);
      toast.error(error.response?.data?.message || "Could Not Update Profile");
    }
    toast.dismiss(toastId);
  };
}