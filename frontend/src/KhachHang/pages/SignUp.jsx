import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Mail,
  Lock,
  CreditCard,
  ChevronRight,
  Phone,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Các biến hằng
const SLIDESHOW_INTERVAL = 5000;
const API_ENDPOINT = "http://localhost:3000/api/auth/register";
const UNSPLASH_API = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = "B43gtozbhTgx8yrT7nahGz3TvskudK0pieUqDWOZjNw";

// Danh sách các điểm đến dùng cho slideshow
const travelDestinations = [
  {
    query: "Premium Travel Experience First Class",
    title: "Premium Travel Experience",
    description: "First-class comfort and luxury service",
  },
  {
    query: "Global Travel Destinations Airport",
    title: "Global Destinations",
    description: "Connect to hundreds of destinations worldwide",
  },
  {
    query: "Exclusive Airport Lounge",
    title: "Exclusive Benefits",
    description: "Enjoy member-only privileges and rewards",
  },
  {
    query: "Luxury Travel Experience",
    title: "Seamless Experience",
    description: "Travel with comfort and peace of mind",
  },
  {
    query: "Modern Aircraft Fleet",
    title: "Modern Fleet",
    description: "Experience the latest in aviation technology",
  },
];

// Trạng thái mặc định cho form đăng ký
const initialFormState = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  id_card: "",
  passport: "",
};

// Component tái sử dụng để tạo các ô nhập liệu
const FormInput = ({ label, icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 h-5 w-5
      transition-colors group-hover:text-blue-800"
      />
    )}
    <input
      {...props}
      placeholder={label}
      className={`
        w-full px-4 py-3.5 rounded-xl
        bg-white/90
        border border-blue-100
        focus:border-blue-600 focus:ring-2 focus:ring-blue-100
        outline-none transition-all duration-300
        ${Icon ? "pl-12" : ""}
        placeholder-slate-400
        text-slate-800
        hover:border-blue-200
        shadow-sm
      `}
    />
  </div>
);

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // Vị trí ảnh hiện tại
  const [slides, setSlides] = useState([]); // Danh sách ảnh trong slideshow
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu

  // Lấy ảnh từ Unsplash API khi component được mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Duyệt qua các điểm đến để lấy ảnh tương ứng
        const imagePromises = travelDestinations.map(async (destination) => {
          const response = await axios.get(UNSPLASH_API, {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, // API key
            },
            params: {
              query: destination.query, // Từ khóa tìm kiếm
              orientation: "landscape", // Chỉ lấy ảnh ngang
              per_page: 1, // Mỗi từ khóa lấy 1 ảnh
            },
          });

          const imageUrl = response.data.results[0].urls.regular; // URL ảnh
          const photographer = response.data.results[0].user.name; // Tên tác giả ảnh
          const photographerUrl = response.data.results[0].user.links.html; // Link tới trang tác giả

          return {
            ...destination,
            url: imageUrl,
            credit: {
              name: photographer,
              url: photographerUrl,
            },
          };
        });

        const results = await Promise.all(imagePromises); // Đợi tất cả API trả về
        setSlides(results); // Cập nhật danh sách ảnh
        setIsLoading(false); // Kết thúc tải dữ liệu
      } catch (error) {
        console.error("Error fetching images:", error);
        setSlides(
          travelDestinations.map((dest) => ({
            ...dest,
            url: `/api/placeholder/1200/800?text=${encodeURIComponent(
              dest.query
            )}`, // Ảnh thay thế khi lỗi
            credit: {
              name: "Placeholder",
              url: "#",
            },
          }))
        );
        setIsLoading(false);
      }
    };

    fetchImages(); // Gọi hàm lấy ảnh
  }, []);

  // Tự động chuyển ảnh sau khoảng thời gian `SLIDESHOW_INTERVAL`
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === (slides.length || travelDestinations.length) - 1 ? 0 : prev + 1
      );
    }, SLIDESHOW_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="relative h-full flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading amazing destinations...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-l-3xl bg-slate-900">
      {slides.map((image, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-all duration-1000 ease-in-out
            ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }
          `}
        >
          <img
            src={image.url}
            alt={image.title}
            className="object-cover w-full h-full opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-3xl font-bold text-white mb-3">
                {image.title}
              </h3>
              <p className="text-slate-200 text-lg mb-2">{image.description}</p>
              <p className="text-sm text-slate-400">
                Photo by{" "}
                <a
                  href={image.credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {image.credit.name}
                </a>{" "}
                on Unsplash
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              transition-all duration-300
              ${
                index === currentSlide
                  ? "w-8 h-2 bg-blue-500"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }
              rounded-full
            `}
          />
        ))}
      </div>
    </div>
  );
};
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "date_of_birth",
    ];
    const missingFields = requiredFields.some((field) => !formData[field]);

    if (missingFields) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms and Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(API_ENDPOINT, formData);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred during registration"
      );
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-50 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-slate-100 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-10">
          <h2 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            QAirlines
          </h2>
          <p className="text-2xl text-slate-600 font-light max-w-2xl mx-auto">
            Your journey to extraordinary travel begins here
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 h-96 md:h-auto">
              <Slideshow />
            </div>

            <div className="md:w-1/2 bg-white p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormInput
                        label="First Name"
                        name="first_name"
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={handleInputChange}
                        icon={User}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormInput
                        label="Last Name"
                        name="last_name"
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={handleInputChange}
                        icon={User}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="date_of_birth"
                      required
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/90
                        border border-blue-100 hover:border-blue-200
                        focus:border-blue-600 focus:ring-2 focus:ring-blue-100
                        outline-none transition-all duration-300 text-slate-800"
                    />
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/90
                          border border-blue-100 hover:border-blue-200
                          focus:border-blue-600 focus:ring-2 focus:ring-blue-100
                          outline-none transition-all duration-300 text-slate-800
                          appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <ChevronRight
                        className="absolute right-4 top-1/2 -translate-y-1/2
                        text-blue-600 h-5 w-5 transform rotate-90"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        icon={Mail}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormInput
                        label="Phone"
                        name="phone"
                        type="text"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        icon={Phone}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      icon={Lock}
                    />
                    <FormInput
                      label="Confirm Password"
                      name="confirm_password"
                      type="password"
                      required
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      icon={Lock}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="ID Card Number"
                      name="id_card"
                      type="text"
                      value={formData.id_card}
                      onChange={handleInputChange}
                      icon={CreditCard}
                    />
                    <FormInput
                      label="Passport Number"
                      name="passport"
                      type="text"
                      value={formData.passport}
                      onChange={handleInputChange}
                      icon={CreditCard}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-5 h-5 rounded-lg bg-white
                        border border-blue-100 text-blue-600
                        focus:ring-2 focus:ring-blue-100 focus:ring-offset-0
                        transition-all duration-300"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600">
                      I accept the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-800 font-medium
                          underline-offset-4 hover:underline"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      w-full py-4 px-6 rounded-xl font-medium
                      transition-all duration-300
                      ${
                        isLoading
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                      }
                      text-white shadow-lg shadow-blue-600/10
                      hover:shadow-blue-600/20
                      active:scale-[0.98]
                    `}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader2 className="animate-spin" />
                        <span>Creating account...</span>
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <p className="text-center text-slate-600 mt-6">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 font-medium
                        underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
