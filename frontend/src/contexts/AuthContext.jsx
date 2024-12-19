import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });

  // Axios Interceptor để gắn token từ localStorage hoặc adminStorage
  api.interceptors.request.use((config) => {
    const token =
      user?.role === "admin"
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    // Lấy thông tin user và token từ không gian lưu trữ tương ứng
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (adminToken && storedAdmin) {
      setUser(JSON.parse(storedAdmin)); // Nếu là admin, thiết lập admin user
      setIsAuthenticated(true);
    } else if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Nếu là client, thiết lập client user
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      // Lưu vào không gian lưu trữ riêng dựa trên role
      if (user.role === "admin") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(user));
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      setIsAuthenticated(true);

      const welcomeMessage =
        user.role === "admin"
          ? `Welcome, admin ${user.name}`
          : `Welcome back${user.first_name ? `, ${user.first_name}` : ""}!`;
      toast.success(welcomeMessage, {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        switch (user.role) {
          case "admin":
            navigate("/admin");
            window.location.reload();
            break;
          case "user":
            const redirectUrl = localStorage.getItem("redirectUrl") || "/";
            localStorage.removeItem("redirectUrl");
            navigate(redirectUrl);
            break;
          default:
            navigate("/");
        }
      }, 2000);
      return user;
    } catch (error) {
      handleLoginError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Xóa token và user tương ứng
    if (user?.role === "admin") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setUser(null);
    setIsAuthenticated(false);

    toast.success("Đã đăng xuất thành công!", {
      position: "top-right",
      autoClose: 3000,
    });

    navigate("/login", { replace: true });
  };

  const handleLoginError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Please provide both email and password");
          break;
        case 401:
          toast.error("Invalid email or password. Please try again.");
          break;
        case 404:
          toast.error("No account found with this email. Please sign up.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error("An unexpected error occurred. Please try again.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("Error processing login. Please try again.");
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    api,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
