import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Footer, Navbar } from "./KhachHang/components";
import { Flights } from "./KhachHang/pages";
import "react-toastify/dist/ReactToastify.css";
import FullFlighList from "./KhachHang/components/FlighList";
import Login from "./KhachHang/pages/Login.jsx";
import SignUp from "./KhachHang/pages/SignUp.jsx";
import SearchResults from "./KhachHang/components/SearchResults.jsx";
import AdminPage from "./Admin/pages/AdminPage.jsx";
import UserBooking from "./KhachHang/pages/UserBooking.jsx";
import { BlogList, BlogDetail } from "./KhachHang/pages/Post.jsx";
import UserProfile from "./KhachHang/pages/UserProfile.jsx";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import { Helmet } from "react-helmet";
import NotFound from "./KhachHang/components/NotFound.jsx";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Tất cả các routes động (có params) cần được định nghĩa pattern
  const dynamicRoutePatterns = [
    /^\/blog\/[^/]+$/, // Matches /blog/{category}
    /^\/blog\/post\/[^/]+$/, // Matches /blog/post/{postId}
    /^\/flights\/oneway\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/,
    /^\/flights\/roundtrip\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/,
  ];
  // Routes tĩnh
  const staticRoutes = [
    "/",
    "/blog",
    "/login",
    "/signup",
    "/fullList",
    "/userbooking",
    "/userprofile",
  ];

  // Kiểm tra xem path hiện tại có match với bất kỳ pattern nào không
  const isValidRoute =
    staticRoutes.includes(location.pathname) || // Kiểm tra routes tĩnh
    dynamicRoutePatterns.some((pattern) => pattern.test(location.pathname)) || // Kiểm tra routes động
    isAdminRoute; // Admin routes

  // Nếu route không hợp lệ, hiển thị 404
  if (!isValidRoute) {
    return (
      <>
        <Helmet>
          <title>404 - Page Not Found</title>
        </Helmet>
        <NotFound />
      </>
    );
  }

  // Các phần còn lại của code giữ nguyên
  if (isLoginPage) {
    return (
      <>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Login />
        <Toaster position="top-center" />
      </>
    );
  }

  if (isAdminRoute) {
    return (
      <>
        <Helmet>
          <title>Admin dashboard</title>
        </Helmet>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </>
    );
  }

  if (location.pathname === "/signup") {
    return (
      <>
        <Helmet>
          <title>Create your account</title>
        </Helmet>
        <SignUp />
        <Toaster position="top-center" expand={true} richColors closeButton />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>QAirline home</title>
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster position="top-center" expand={true} richColors closeButton />
      <div className="font-sans min-h-screen relative">
        <div className="fixed inset-0 z-[-1]">
          <img
            src="/hi.jpg"
            alt="background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative w-full">
          <Navbar />
          <div className="max-w-[1440px] mx-auto px-4">
            <Routes>
              <Route path="/blog/:category" element={<BlogList />} />
              <Route path="/blog/post/:postId" element={<BlogDetail />} />
              <Route path="/" element={<Flights />} />
              <Route path="/fullList" element={<FullFlighList />} />
              <Route
                path="/flights/oneway/:departure/:destination/:departure_time/:amount"
                element={<SearchResults />}
              />
              <Route
                path="/flights/roundtrip/:departure/:destination/:departure_time/:return_time/:amount"
                element={<SearchResults />}
              />
              <Route path="/userbooking" element={<UserBooking />} />
              <Route path="/userprofile" element={<UserProfile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
