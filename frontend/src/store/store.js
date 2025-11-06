import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";  // ✅ nhớ chữ thường và tên file đúng

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: true,
});

export default store;
