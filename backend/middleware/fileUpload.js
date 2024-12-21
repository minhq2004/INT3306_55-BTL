const multer = require("multer");
const path = require("path");

// Cấu hình Multer để lưu trữ tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lấy category từ body, nếu không có thì mặc định là 'default'
    const postCategory = req.body.category;
    const uploadPath = path.join(__dirname, "..", "public", postCategory); // Sử dụng đường dẫn tương đối
    cb(null, uploadPath); // Đảm bảo thư mục đã tồn tại
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất bằng cách kết hợp timestamp và tên file gốc
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Cấu hình Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Giới hạn tệp lên tới 25MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/; // Hỗ trợ JPEG, JPG, PNG, PDF
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true); // Nếu tệp hợp lệ, tiếp tục
    } else {
      cb(new Error("Only JPEG, JPG, PNG, and PDF files are allowed."));
    }
  },
}).array("files", 5); // Cho phép tải lên tối đa 5 tệp

module.exports = upload;
