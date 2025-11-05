import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// Gắn accessToken vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý refresh token khi bị 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu API trả về 403 và request này chưa được thử lại
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      try {
        // gọi refresh token
        const res = await api.post("/auth/refresh", { refreshToken });

        // lưu token mới
        localStorage.setItem("accessToken", res.data.accessToken);

        // gắn token mới vào request cũ rồi chạy lại
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);

      } catch (err) {
        // refresh cũng fail → logout
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
