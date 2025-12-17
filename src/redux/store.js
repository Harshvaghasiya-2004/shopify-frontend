// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice"; // added orders slice
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice"; // admin product slice
import adminOrderReducer from "./slices/adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer, // added orders
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
  },
});

export default store;
