import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import UserAvatarDropdown from "./UserAvatarDropdown";
import {
  Search,
  Ticket,
  LogIn,
  Newspaper,
  ChevronDown,
  Megaphone,
  Info,
  Gift,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  const locationPath = (route) => route === location.pathname; // Hàm kiểm tra đường dẫn hiện tại
  const handleLogin = () => navigate("/login"); // Hàm điều hướng đến trang đăng nhập

  const navItems = [
    { path: "/", icon: Search, label: "Tìm chuyến bay" },
    { path: "/userbooking", icon: Ticket, label: "Vé của bạn" },
  ];

  const blogCategories = [
    {
      path: "/blog/news",
      query: "news",
      icon: Newspaper,
      label: "Tin tức",
      description: "Cập nhật tin tức mới nhất về ngành hàng không",
    },
    {
      path: "/blog/promotions",
      query: "promotion",
      icon: Gift,
      label: "Khuyến mãi",
      description: "Các ưu đãi và khuyến mãi hấp dẫn",
    },
    {
      path: "/blog/announcements",
      query: "announcement",
      icon: Megaphone,
      label: "Thông báo",
      description: "Các thông báo quan trọng từ Q Airlines",
    },
    {
      path: "/blog/about",
      query: "about",
      icon: Info,
      label: "Về chúng tôi",
      description: "Tìm hiểu thêm về Q Airlines",
    },
  ];

  const NavLink = ({ path, icon: Icon, label, showDivider }) => (
    <div className="flex items-center">
      <Link
        to={path}
        className={`
          group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl
          transition-all duration-300 min-w-[140px] overflow-hidden
          ${
            locationPath(path)
              ? isScrolled
                ? "text-blue-600 font-semibold shadow-lg shadow-blue-100/50"
                : "text-white font-semibold shadow-lg shadow-white/10"
              : isScrolled
              ? "text-blue-950 hover:text-blue-600"
              : "text-white"
          }
          hover:scale-105 hover:-translate-y-0.5 active:scale-95
          before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-300
          ${
            locationPath(path)
              ? isScrolled
                ? "before:bg-blue-50/90 before:border before:border-blue-200/50"
                : "before:bg-white/20"
              : isScrolled
              ? "before:bg-transparent hover:before:bg-blue-50/80"
              : "before:bg-transparent hover:before:bg-white/20"
          }
        `}
      >
        {locationPath(path) && (
          <span className="absolute inset-0 rounded-xl blur-lg bg-gradient-to-r from-blue-400/20 to-cyan-400/20" />
        )}
        <Icon
          className={`relative w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
            ${
              locationPath(path)
                ? isScrolled
                  ? "text-blue-600"
                  : "text-white"
                : isScrolled
                ? "text-blue-900 group-hover:text-blue-600"
                : "text-white"
            }
          `}
        />
        <span className="relative font-medium">{label}</span>
      </Link>
      {showDivider && (
        <div
          className={`h-8 w-px mx-2 ${
            isScrolled ? "bg-gray-200" : "bg-white/20"
          }`}
        />
      )}
    </div>
  );

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-500
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-xl shadow-lg py-2 border-b border-blue-100/50"
              : "bg-gradient-to-b from-black/20 to-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="relative flex-shrink-0 flex items-center group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/qairline.jpg"
                  alt="Qairline"
                  className="relative h-12 w-12 rounded-full transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/20"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between flex-1 ml-8">
              <div className="flex items-center justify-center space-x-2 flex-1">
                {navItems.map((item, index) => (
                  <NavLink
                    key={item.path}
                    {...item}
                    showDivider={index < navItems.length - 1}
                  />
                ))}

                <div
                  className={`h-8 w-px mx-2 ${
                    isScrolled ? "bg-gray-200" : "bg-white/20"
                  }`}
                />

                {/* Explore Dropdown */}
                <div className="relative" ref={exploreRef}>
                  <button
                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                    className={`
                      group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                      transition-all duration-300 min-w-[140px] overflow-hidden
                      hover:scale-105 hover:-translate-y-0.5 active:scale-95
                      ${
                        isScrolled
                          ? "text-blue-950 hover:text-blue-600"
                          : "text-white"
                      }
                      before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-300
                      ${
                        isScrolled
                          ? "before:bg-transparent hover:before:bg-blue-50/80"
                          : "before:bg-transparent hover:before:bg-white/20"
                      }
                    `}
                  >
                    <Sparkles
                      className={`relative w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
                        ${
                          isScrolled
                            ? "text-blue-900 group-hover:text-blue-600"
                            : "text-white"
                        }`}
                    />
                    <span className="relative font-medium">Khám phá</span>
                    <ChevronDown
                      className={`relative w-4 h-4 transition-all duration-300
                        ${isExploreOpen ? "rotate-180" : ""}
                        ${isScrolled ? "text-blue-900" : "text-white"}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isExploreOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden z-50 transform transition-all duration-300 animate-fade-in-up">
                      <div className="p-3">
                        {blogCategories.map((category) => (
                          <Link
                            key={category.query}
                            to={category.path}
                            onClick={() => setIsExploreOpen(false)}
                            className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50
            hover:scale-[0.98] hover:shadow-inner"
                          >
                            <div
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100
            flex items-center justify-center transition-all duration-300
            group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-blue-200/50"
                            >
                              <category.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {category.label}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {category.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Auth Button */}
              <div className="flex items-center ml-8">
                {!isLoggedIn ? (
                  <button
                    onClick={handleLogin}
                    className={`relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      transition-all duration-300 font-medium
                      hover:scale-105 hover:-translate-y-0.5 active:scale-95
                      ${
                        isScrolled
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
                          : "bg-white text-blue-600 hover:shadow-lg hover:shadow-white/30"
                      }
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <LogIn className="relative w-5 h-5" />
                    <span className="relative">Đăng nhập</span>
                  </button>
                ) : (
                  <UserAvatarDropdown />
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className={`p-3 rounded-xl transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${
                    isScrolled
                      ? "text-blue-900 hover:bg-blue-50/80"
                      : "text-white hover:bg-white/20"
                  }`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-24" />
    </>
  );
};

export default Navbar;
