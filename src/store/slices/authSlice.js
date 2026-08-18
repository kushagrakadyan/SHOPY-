import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("shopy_user") || "null");

const initialState = {
  user: persisted,
  token: localStorage.getItem("shopy_token") || null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.status = "loading";
      state.error = null;
    },
    authSucceeded(state, action) {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("shopy_user", JSON.stringify(action.payload.user));
      localStorage.setItem("shopy_token", action.payload.token);
    },
    authFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      localStorage.removeItem("shopy_user");
      localStorage.removeItem("shopy_token");
    },
    clearAuthError(state) {
      state.error = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("shopy_user", JSON.stringify(state.user));
    },
  },
});

export const { authStart, authSucceeded, authFailed, logout, clearAuthError, updateUser } = authSlice.actions;
export default authSlice.reducer;
