import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("shopy_wishlist") || "[]");

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: persisted },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      const exists = state.items.includes(id);
      state.items = exists ? state.items.filter((i) => i !== id) : [...state.items, id];
      localStorage.setItem("shopy_wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
