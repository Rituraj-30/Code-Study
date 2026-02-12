import { toast } from "react-hot-toast";
import { setUser, setLoading } from "../../redux/slices/profileSlice"; // Path check kar lena
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";

const { GET_USER_DETAILS_API } = profileEndpoints;

export function getUserDetails(token: string, navigate: any) {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser({ ...response.data.data }));
    } catch (error: any) {
      console.log("GET_USER_DETAILS_API ERROR...", error);
      toast.error("Could Not Get User Details");
    }
    dispatch(setLoading(false));
  };
}