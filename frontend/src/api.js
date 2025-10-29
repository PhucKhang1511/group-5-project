import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🟢 Tự động gắn Access Token vào Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🟡 Khi Access Token hết hạn → tự refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("⚠️ Access Token hết hạn → Đang làm mới token...");

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          refreshToken,
        });

        // Lưu token mới
        localStorage.setItem("accessToken", res.data.accessToken);

        // Gửi lại request cũ với token mới
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(error.config);

      } catch (refreshError) {
        console.log("❌ Refresh token hết hạn → Đăng xuất!");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
