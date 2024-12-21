const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const {
  createAirplane,
  updateAirplane,
  deleteAirplane,
} = require("../controllers/airplaneController");
const {
  createFlight,
  updateFlight,
  deleteFlight,
  getFlightStatistic,
} = require("../controllers/flightController");
const {
  getAllBookings,
  getBookingStatistics,
} = require("../controllers/bookingController");
const { registerAdmin } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/userController");
const { getAllAdmins, updateAdmin } = require("../controllers/adminController");
const {
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const {
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discountController");
const upload = require("../middleware/fileUpload"); // Import cấu hình Multer

// Quản lý bài viết (CRUD)
router.post(
  "/posts",
  authenticateToken,
  authorizeRole("admin"),
  upload,
  createPost
); // Tạo bài viết
router.put(
  "/posts/:post_id",
  authenticateToken,
  authorizeRole("admin"),
  upload,
  updatePost
); // Cập nhật bài viết
router.delete(
  "/posts/:post_id",
  authenticateToken,
  authorizeRole("admin"),
  deletePost
); // Xóa bài viết

// Quản lý máy bay
router.post(
  "/airplanes",
  authenticateToken,
  authorizeRole("admin"),
  createAirplane
); // Tạo máy bay
router.put(
  "/airplanes/:airplane_id",
  authenticateToken,
  authorizeRole("admin"),
  updateAirplane
); // Cập nhật máy bay
router.delete(
  "/airplanes/:airplane_id",
  authenticateToken,
  authorizeRole("admin"),
  deleteAirplane
); // Xóa máy bay

// Quản lý chuyến bay
router.post(
  "/flights",
  authenticateToken,
  authorizeRole("admin"),
  createFlight
); // Tạo chuyến bay
router.put(
  "/flights/:flight_id",
  authenticateToken,
  authorizeRole("admin"),
  updateFlight
); // Cập nhật chuyến bay
router.delete(
  "/flights/:flight_id",
  authenticateToken,
  authorizeRole("admin"),
  deleteFlight
); // Xóa chuyến bay
// Thong ke Flight
router.get(
  "/flights/stats",
  authenticateToken,
  authorizeRole("admin"),
  getFlightStatistic
);

// Thong ke Booking
router.get(
  "/bookings/page/:page",
  authenticateToken,
  authorizeRole("admin"),
  getAllBookings
);
router.get(
  "/bookings/stats",
  authenticateToken,
  authorizeRole("admin"),
  getBookingStatistics
);

// Quan ly admin
// Route đăng ký admin chi duoc admin tao
router.post(
  "/register/admins",
  authenticateToken,
  authorizeRole("admin"),
  registerAdmin
);
// Lấy tất cả tài khoản admin
router.get(
  "/admins/page/:page",
  authenticateToken,
  authorizeRole("admin"),
  getAllAdmins
);
// Cập nhật thông tin admin theo admin_id
router.patch(
  "/admins/:admin_id",
  authenticateToken,
  authorizeRole("admin"),
  updateAdmin
);

// Quan ly user
// Route để lấy thông tin tất cả người dùng
router.get(
  "/users/page/:page",
  authenticateToken,
  authorizeRole("admin"),
  getAllUsers
);

// Quan ly service
router.post(
  "/services",
  authenticateToken,
  authorizeRole("admin"),
  createService
);
router.put(
  "/services/:service_id",
  authenticateToken,
  authorizeRole("admin"),
  updateService
);
router.delete(
  "/services/:service_id",
  authenticateToken,
  authorizeRole("admin"),
  deleteService
);

// Quan ly discount
router.get(
  "/discounts",
  authenticateToken,
  authorizeRole("admin"),
  getAllDiscounts
);
router.post(
  "/discounts",
  authenticateToken,
  authorizeRole("admin"),
  createDiscount
);
router.put(
  "/discounts/:discount_id",
  authenticateToken,
  authorizeRole("admin"),
  updateDiscount
);
router.delete(
  "/discounts/:discount_id",
  authenticateToken,
  authorizeRole("admin"),
  deleteDiscount
);

module.exports = router;
