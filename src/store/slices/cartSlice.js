import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("shopy_cart") || "[]");

function persist(items) {
  localStorage.setItem("shopy_cart", JSON.stringify(items));
}

function lineKey(item) {
  return `${item.productId}::${JSON.stringify(item.selectedVariants || {})}`;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: persisted, couponCode: null, couponDiscount: 0 },
  reducers: {
    addToCart(state, action) {
      const incoming = action.payload;
      const key = lineKey(incoming);
      const existing = state.items.find((i) => lineKey(i) === key);
      if (existing) {
        existing.qty += incoming.qty;
      } else {
        state.items.push(incoming);
      }
      persist(state.items);
    },
    updateQty(state, action) {
      const { key, qty } = action.payload;
      const item = state.items.find((i) => lineKey(i) === key);
      if (item) item.qty = Math.max(1, qty);
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => lineKey(i) !== action.payload);
      persist(state.items);
    },
    applyCoupon(state, action) {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
      persist([]);
    },
  },
});

export const { addToCart, updateQty, removeFromCart, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export { lineKey };
