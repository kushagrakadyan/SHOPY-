import { createSlice } from "@reduxjs/toolkit";

const storeSlice = createSlice({
  name: "stores",
  initialState: { list: [], status: "idle", current: null, currentStatus: "idle", error: null },
  reducers: {
    fetchStoresStart(state) {
      state.status = "loading";
    },
    fetchStoresSucceeded(state, action) {
      state.status = "succeeded";
      state.list = action.payload;
    },
    fetchStoresFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    fetchStoreStart(state) {
      state.currentStatus = "loading";
    },
    fetchStoreSucceeded(state, action) {
      state.currentStatus = "succeeded";
      state.current = action.payload;
    },
    fetchStoreFailed(state, action) {
      state.currentStatus = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  fetchStoresStart,
  fetchStoresSucceeded,
  fetchStoresFailed,
  fetchStoreStart,
  fetchStoreSucceeded,
  fetchStoreFailed,
} = storeSlice.actions;
export default storeSlice.reducer;
