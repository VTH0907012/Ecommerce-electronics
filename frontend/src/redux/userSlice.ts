import { User } from "@/type/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export const userReducer = userSlice.reducer;
