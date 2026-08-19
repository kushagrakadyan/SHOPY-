import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: { list: [], status: "idle", lastCreated: null, error: null },
  reducers: {
    fetchOrdersStart(state) {
      state.status = "loading";
    },
    fetchOrdersSucceeded(state, action) {
      state.status = "succeeded";
      state.list = action.payload;
    },
    fetchOrdersFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    orderCreated(state, action) {
      state.lastCreated = action.payload;
      state.list = [action.payload, ...state.list];
    },
  },
});

export const { fetchOrdersStart, fetchOrdersSucceeded, fetchOrdersFailed, orderCreated } = orderSlice.actions;
export default orderSlice.reducer;
