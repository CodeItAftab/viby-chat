import { getRequest, postRequest } from "@/lib/axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetUserSlice } from "./user";
import { resetChatSlice } from "./chat";

const initialState = {
  userId: undefined,
  isLoggedIn: false,
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userId = undefined;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = slice.actions;

export default slice.reducer;

export const LoginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { dispatch }) => {
    try {
      const response = await postRequest("/auth/login", data);
      if (response.success) {
        console.log(response.userId);
        window.localStorage.setItem("reload", "true");
        dispatch(slice.actions.login({ userId: response.userId }));
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
);

export const LogoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/auth/logout");
      if (response.success) {
        window.localStorage.removeItem("reload");
        dispatch(resetUserSlice());
        dispatch(slice.actions.logout());
        dispatch(resetChatSlice());
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const RegisterUser = createAsyncThunk(
  "auth/registerUser",
  async (data) => {
    try {
      const response = await postRequest("/auth/register", data);
      if (response.success) {
        window.localStorage.setItem("email", data.email);
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const VerifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { dispatch }) => {
    try {
      const response = await postRequest("/auth/verify_otp", data);
      if (response.success) {
        dispatch(slice.actions.login({ userId: response.userId }));
        window.localStorage.removeItem("email");
      }
    } catch (err) {
      console.log(err);
    }
  }
);
