const fs = require("fs");
const path = require("path");
const { Post, File } = require("../models");

// Hàm để xoá file khỏi thư mục public
const deleteFileFromPublic = (filePath) => {
  try {
    // Đảm bảo filePath là đường dẫn tuyệt đối
    const absoluteFilePath = path.resolve(__dirname, "..", "public", filePath); // Sử dụng __dirname và '..' để tính toán đường dẫn tuyệt đối

    // Kiểm tra nếu file tồn tại trước khi xoá
    fs.unlink(absoluteFilePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      } else {
        console.log("File deleted successfully:", absoluteFilePath);
      }
    });
  } catch (error) {
    console.error("Error while deleting file:", error.message);
  }
};

// Ham tao post
const createPost = async (req, res) => {
  const { title, content, category } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "Missing required fields: title, content, category" });
  }

  try {
    // Tạo bài viết mới
    const post = await Post.create({
      title,
      content,
      category,
    });

    // Nếu có file, lưu thông tin các file vào bảng `files`
    if (req.files && req.files.length > 0) {
      const fileData = req.files.map((file) => ({
        post_id: post.post_id, // Đảm bảo sử dụng post_id từ bài viết vừa tạo
        file_path: path.relative(
          path.join(__dirname, "..", "public"),
          file.path
        ), // Lưu đường dẫn tương đối
        file_name: file.originalname,
        file_type: file.mimetype,
      }));

      // Lưu thông tin file vào bảng `files`
      await File.bulkCreate(fileData); // Bulk insert vào bảng files
    }

    res.status(201).json({
      message: "Post created successfully",
      post_id: post.post_id,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Chinh sua post
const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;

  // Kiểm tra xem bài viết có tồn tại hay không
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Missing required fields: title, content" });
  }

  try {
    // Tìm bài viết theo ID
    const post = await Post.findByPk(post_id); // Tìm bài viết theo ID

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Cập nhật thông tin bài viết
    post.title = title;
    post.content = content;

    // Kiểm tra nếu có file mới
    if (req.files && req.files.length > 0) {
      const fileData = req.files.map((file) => ({
        post_id: post_id,
        file_path: path.relative(
          path.join(__dirname, "..", "public"),
          file.path
        ), // Đường dẫn tương đối
        file_name: file.originalname,
        file_type: file.mimetype,
      }));

      // Kiểm tra nếu fileData có dữ liệu
      if (fileData.length > 0) {
        console.log("File data to insert:", fileData); // Log để kiểm tra dữ liệu

        // Thêm các file vào bảng `files` thông qua Sequelize
        await File.bulkCreate(fileData).catch((error) => {
          console.error("Error saving files:", error);
          res.status(500).json({ error: "Failed to save files" });
        });
      }
    }

    // Xoá file không còn liên quan
    if (req.body.filesToDelete && req.body.filesToDelete.length > 0) {
      const fileIdsToDelete = req.body.filesToDelete;

      // Tìm các file trong cơ sở dữ liệu
      const filesToDelete = await File.findAll({
        where: {
          file_id: fileIdsToDelete,
        },
        attributes: ["file_path"],
      });

      // Kiểm tra nếu có file để xóa
      if (filesToDelete.length > 0) {
        // Xoá file khỏi thư mục public
        filesToDelete.forEach((file) => {
          console.log("Deleting file:", file.file_path); // Log để kiểm tra file path
          deleteFileFromPublic(file.file_path); // Xoá file khỏi thư mục public
        });

        // Xoá các file trong cơ sở dữ liệu
        await File.destroy({
          where: {
            file_id: fileIdsToDelete,
          },
        });
      }
    }

    // Lưu lại thay đổi bài viết sau khi xử lý file
    await post.save(); // Lưu lại thay đổi bài viết

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lay danh sach post theo category
const getAllPostsByCategory = async (req, res) => {
  try {
    // Lấy các tham số phân trang và category từ URL params
    const { page = 1, limit = 10, category } = req.params;

    // Kiểm tra nếu category không hợp lệ
    if (
      category &&
      !["news", "promotion", "announcement", "about"].includes(category)
    ) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Tính toán offset và limit để phân trang
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // Lọc bài viết theo category (nếu có)
    const whereCondition = category ? { category } : {};

    // Lấy tổng số bài viết theo category (để trả về số trang, tổng số bài viết...)
    const totalPosts = await Post.count({
      where: whereCondition,
    });

    // Lấy các bài viết từ bảng `posts` có phân trang và lọc theo category
    const posts = await Post.findAll({
      where: whereCondition,
      offset,
      limit: limitInt,
      order: [["createdAt", "DESC"]], // Sắp xếp bài viết theo createdAt giảm dần
    });

    // Nếu không có bài viết nào, trả về mảng rỗng
    if (posts.length === 0) {
      return res.status(200).json({
        posts: [],
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limitInt),
      });
    }

    // Lấy tất cả các file từ bảng `files`
    const files = await File.findAll();

    // Gắn các file vào mỗi bài viết theo post_id
    const postsWithFiles = posts.map((post) => {
      // Lọc các file liên quan đến mỗi bài viết
      const postFiles = files.filter((file) => file.post_id === post.post_id);

      // Trả về bài viết với thông tin file kèm theo
      return {
        ...post.toJSON(), // Các trường dữ liệu bài viết
        files: postFiles.map((file) => ({
          file_id: file.file_id,
          // Chuyển đường dẫn file từ tuyệt đối thành tương đối
          file_path: file.file_path
            .replace(/\\/g, "/") // Thay thế dấu "\" thành "/"
            .replace(path.join(__dirname, "../public"), "/public"), // Thay thế bằng đường dẫn tương đối
          file_name: file.file_name,
          file_type: file.file_type,
        })),
      };
    });

    // Trả về dữ liệu bài viết kèm các file và thông tin phân trang
    res.status(200).json({
      posts: postsWithFiles,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limitInt),
      totalPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lay thong tin chi tiet cua mot post
const getPostByID = async (req, res) => {
  try {
    // Lấy post_id từ URL params
    const { post_id } = req.params;

    // Kiểm tra nếu post_id không hợp lệ
    if (!post_id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Lấy bài viết từ bảng `posts` theo post_id
    const post = await Post.findOne({
      where: { post_id }, // Tìm bài viết theo post_id
    });

    // Nếu bài viết không tồn tại, trả về lỗi 404
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Lấy tất cả các file từ bảng `files`
    const files = await File.findAll();

    const postFiles = files.filter((file) => file.post_id === post.post_id);

    // Gắn các file vào mỗi bài viết theo post_id
    const postWithFiles = {
      ...post.toJSON(), // Các trường dữ liệu bài viết
      files: postFiles.map((file) => ({
        file_id: file.file_id,
        // Chuyển đường dẫn file từ tuyệt đối thành tương đối
        file_path: file.file_path
          .replace(/\\/g, "/") // Thay thế dấu "\" thành "/"
          .replace(path.join(__dirname, "../public"), "/public"), // Thay thế bằng đường dẫn tương đối
        file_name: file.file_name,
        file_type: file.file_type,
      })),
    };

    res.status(200).json(postWithFiles);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Ham xoa post
const deletePost = async (req, res) => {
  const postId = req.params.post_id;

  try {
    // Lấy thông tin các file liên quan đến post
    const files = await File.findAll({
      where: { post_id: postId },
    });

    // Xoá các file khỏi thư mục public
    files.forEach((file) => {
      const filePath = path.join(__dirname, "..", "public", file.file_path); // Tạo đường dẫn tuyệt đối để xoá
      deleteFileFromPublic(filePath); // Xoá từng file khỏi thư mục
    });

    // Xoá các file liên quan khỏi cơ sở dữ liệu
    await File.destroy({
      where: { post_id: postId },
    });

    // Xoá bài viết khỏi cơ sở dữ liệu
    await Post.destroy({
      where: { post_id: postId },
    });

    res
      .status(200)
      .json({ message: "Post and associated files deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getAllPostsByCategory,
  getPostByID,
  updatePost,
  deletePost,
};
