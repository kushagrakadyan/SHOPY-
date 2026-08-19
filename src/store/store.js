import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import cartReducer from "./slices/cartSlice.js";
import productReducer from "./slices/productSlice.js";
import storeReducer from "./slices/storeSlice.js";
import orderReducer from "./slices/orderSlice.js";
import wishlistReducer from "./slices/wishlistSlice.js";
import uiReducer from "./slices/uiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    stores: storeReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
});
