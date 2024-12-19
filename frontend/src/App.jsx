import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Footer, Navbar } from "./components";
import { Flights } from "./pages/client/index.js";
import "react-toastify/dist/ReactToastify.css";
import FullFlighList from "./components/FlighList";
import Login from "./pages/client/Login.jsx";
import SignUp from "./pages/client/SignUp.jsx";
import SeatMap from "./components/SeatMap.jsx";
import SearchResults from "./components/SearchResults.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import UserBooking from "./pages/client/UserBooking.jsx";
import { BlogList, BlogDetail } from "./pages/client/PostFinal.jsx";
import UserProfile from "./pages/client/UserProfile.jsx";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import UpcomingBookings from "./pages/client/UpcomingBookings.jsx";
import { Helmet } from "react-helmet";
const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If we're on the login page, render only the login component
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

  // Otherwise render the normal layout with navbar and footer
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
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:postId" element={<BlogDetail />} />
              <Route path="/" element={<Flights />} />
              <Route path="/login" element={<Login />} />
              <Route path="/fullList" element={<FullFlighList />} />
              <Route path="/seatmap" element={<SeatMap />} />
              <Route path="/upcoming" element={<UpcomingBookings />} />

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
              <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
