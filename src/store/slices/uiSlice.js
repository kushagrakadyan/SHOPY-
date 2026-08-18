import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { mobileNavOpen: false, cartDrawerOpen: false },
  reducers: {
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
    toggleCartDrawer(state) {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    closeCartDrawer(state) {
      state.cartDrawerOpen = false;
    },
  },
});

export const { toggleMobileNav, closeMobileNav, toggleCartDrawer, closeCartDrawer } = uiSlice.actions;
export default uiSlice.reducer;
