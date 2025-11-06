import { createSlice } from "@reduxjs/toolkit";

function safeParse(data) {
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: safeParse(localStorage.getItem("user")),
  token: localStorage.getItem("accessToken") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
