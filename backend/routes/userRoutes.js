const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  bookTicket,
  cancelBooking,
  getBookingsByUser,
  payForBooking
} = require("../controllers/bookingController");
const { updateUser, getUserInfo } = require("../controllers/userController");

// Đặt vé
router.post("/bookings", authenticateToken, authorizeRole("user"), bookTicket);

// Hủy vé
router.delete(
  "/bookings/cancel/:booking_id",
  authenticateToken,
  authorizeRole("user"),
  cancelBooking
);

// Xem vé đã đặt của khách hàng
router.get(
  "/bookings/user/page/:page",
  authenticateToken,
  authorizeRole("user"),
  getBookingsByUser
);

// Thanh toan vé
router.get(
  "/bookings/payment/:booking_id",
  authenticateToken,
  authorizeRole("user"),
  payForBooking
);

router.get("/info", authenticateToken, authorizeRole("user"), getUserInfo);

// Route cập nhật thông tin cá nhân
router.patch("/update", authenticateToken, authorizeRole("user"), updateUser);

module.exports = router;