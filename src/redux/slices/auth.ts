"use client";
import { User } from "@/models/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export default authSlice.reducer;

export const { login, logout } = authSlice.actions;

// ----------------------------------------------------------------------

// export const registerSeach = (payload: string | null) => (dispatch: any) => {
//   dispatch(setSeach(payload || ""));
// };
