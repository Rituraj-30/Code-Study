

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// User ka interface define kar rahe hain taki TypeScript error na de
interface User {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  accountType: "Student" | "Instructor" | "Admin";
  // Aur jo bhi fields tumhare backend se aa rahi hain wo yahan add kar sakte ho
}

interface ProfileState {
  user: User | null;
  loading: boolean;
}

// LocalStorage se purana data uthane ki koshish kar rahe hain
const storedUser = localStorage.getItem("user");
const initialState: ProfileState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      // Data ko localStorage mein bhi daal dete hain taki refresh par na ude
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;