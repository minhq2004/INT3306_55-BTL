import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext.jsx"; // Import the useAuth hook

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loading } = useAuth(); // Use the login and loading from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the login method from AuthContext
      await login(formData);
    } catch (error) {
      // Error handling is now done in the AuthContext login method
      // No additional error handling needed here
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-gray-100 bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: "url('hi.jpg')",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="backdrop-blur-md bg-white/60 bg-white p-8 shadow-lg max-w-md w-3/5 rounded-[30px]">
        <div className="text-center">
          <div className="flex justify-center">
            <Link to="/">
              <img
                src="/qairline.jpg"
                alt="Qairline"
                className="justify-between size-16 rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-sm hover:shadow-blue-500/20"
              />
            </Link>
          </div>

          <p className="mt-1 text-3xl font-bold text-gray-800 mb-3">
            Welcome to QAirline!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-cyan-500 text-white py-3 rounded-lg font-medium
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-cyan-600 shadow-lg shadow-cyan-500/50"
                } 
                transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-600">
            Do not have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Sign up for Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
