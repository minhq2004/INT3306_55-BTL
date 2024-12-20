import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";

const adminToken = localStorage.getItem("adminToken");

const DangThongTin = () => {
  //State quản lý thêm post mới
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "news",
    files: [],
  });

  //State quản lý lỗi và tải
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //State quản lý form khi chỉnh sửa
  const [formData, setFormData] = useState([]);

  //State quản lý file xem trước khi thêm post mới
  const [previewFiles, setPreviewFiles] = useState([]);

  //State quản lý các post để hiển thị danh sách
  const [posts, setPosts] = useState([]);

  //Các state quản lý phân trang
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("news");

  //State quản lý bảng chỉnh sửa
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm kiểm tra định dạng file hợp lệ
  const isValidFileType = (file) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    return allowedTypes.includes(file.type);
  };

  // Xử lý thêm file
  const handleFileChange = (e) => {
    const newFilesArray = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    newFilesArray.forEach((file) => {
      if (isValidFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file format: ${invalidFiles.join(
          ", "
        )}. Only .pdf, .png, .jpg are allowed.`
      );
    }

    if (validFiles.length > 0) {
      setNewPost((prevPost) => ({
        ...prevPost,
        files: [...(prevPost.files || []), ...validFiles],
      }));

      setPreviewFiles((prevFiles) => [
        ...prevFiles,
        ...validFiles.map((file) => file.name),
      ]);
    }
  };

  // Xóa file khỏi danh sách file cần thêm
  const handleRemoveFile = (fileIndex) => {
    setNewPost((prevPost) => {
      const updatedFiles = [...prevPost.files];
      updatedFiles.splice(fileIndex, 1); // Xóa file theo chỉ mục
      return { ...prevPost, files: updatedFiles };
    });

    setPreviewFiles((prevFiles) => {
      const updatedPreviewFiles = [...prevFiles];
      updatedPreviewFiles.splice(fileIndex, 1); // Xóa tên file khỏi danh sách xem trước
      return updatedPreviewFiles;
    });
  };

  // Gửi bài viết mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", newPost.title);
    data.append("content", newPost.content);
    data.append("category", newPost.category);
    newPost.files.forEach((file) => {
      data.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:3000/api/admin/posts/", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.ok) {
        toast.success("Post created successfully!");
        fetchPosts(currentPage);
        setNewPost({ title: "", content: "", category: "news", files: [] });
        setPreviewFiles([]);
      } else {
        const result = await response.json();
        toast.error(result.message || "An error occurred");
      }
    } catch (error) {
      toast.error("Failed to create post.");
    }
  };

  // Lấy danh sách bài viết
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/posts/${category}/page/${page}/`
      );
      const { posts, totalPosts, totalPages } = response.data;
      setPosts(posts);
      setTotalPosts(totalPosts);
      setTotalPages(totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [category, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPosts(newPage);
    }
  };

  // Mở modal chỉnh sửa
  const openModal = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      files: post.files || [],
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setFormData({ title: "", content: "", files: [] });
    setPreviewFiles([]);
  };

  // Xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cập nhật bài viết
  const handleUpdatePost = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);

    // Thêm các file mới
    selectedPost.newFiles?.forEach((file) => {
      data.append("files", file);
    });

    // Thêm danh sách file cần xóa
    if (selectedPost.filesToDelete && selectedPost.filesToDelete.length > 0) {
      selectedPost.filesToDelete.forEach((file_id) => {
        data.append("filesToDelete", file_id);
      });
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/posts/${selectedPost.post_id}`,
        {
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response.ok) {
        toast.success("The post has been updated!");
        fetchPosts(); // Fetch lại danh sách bài viết
        closeModal();
      } else {
        const result = await response.json();
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileDelete = (fileId) => {
    setSelectedPost((prevPost) => {
      const updatedFiles = prevPost.files.filter(
        (file) => file.file_id !== fileId
      ); // Loại bỏ file khỏi danh sách files
      return {
        ...prevPost,
        files: updatedFiles,
        filesToDelete: [...(prevPost.filesToDelete || []), fileId], // Thêm file vào mảng cần xóa
      };
    });
    console.log(selectedPost);
  };

  // Cập nhật post
  const handleNewFileChange = (e) => {
    const newFilesArray = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    newFilesArray.forEach((file) => {
      if (isValidFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file format: ${invalidFiles.join(
          ", "
        )}. Only .pdf, .png, .jpg are allowed.`
      );
    }

    if (validFiles.length > 0) {
      setSelectedPost((prevPost) => ({
        ...prevPost,
        newFiles: [...(prevPost.newFiles || []), ...validFiles],
      }));
    }
  };

  const handleRemoveNewFile = (fileIndex) => {
    setSelectedPost((prevPost) => {
      const updatedNewFiles = [...(prevPost.newFiles || [])];
      updatedNewFiles.splice(fileIndex, 1);
      return { ...prevPost, newFiles: updatedNewFiles };
    });
  };

  // Xóa bài viết
  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      if (response.ok) {
        toast.success("Post removed successfully!");
        fetchPosts();
      }
      closeModal();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-4">
      {/* Form đăng bài */}
      <div className="rounded-lg bg-white flex flex-col overflow-auto shadow-md h-full">
        <h1 className="font-bold text-xl mt-2 ml-4">Add post</h1>
        <form onSubmit={handleSubmit} className="p-4 flex-col w-full">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Content</label>
            <textarea
              name="content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded peer block leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded"
              required
            >
              <option value="news">News</option>
              <option value="promotion">Promotion</option>
              <option value="announcement">Announcement</option>
              <option value="about">About</option>
            </select>
          </div>
          <div className="block sm:flex mt-2 space-y-4">
            <div className="flex-1">
              <label className="block text-gray-700">Attached file</label>
              <FileUpload onChange={handleFileChange} />

              {previewFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-gray-700 font-medium mb-2">
                    Selected file
                  </h3>
                  <ul className="list-disc pl-5">
                    {previewFiles.map((file, index) => (
                      <li key={index} className="flex justify-between">
                        {file}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:underline text-xs ml-auto flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-1 items-end">
              <button
                type="submit"
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600  ml-auto w-full sm:w-1/3 duration-300"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Danh sách bài viết */}
      <div className="bg-white p-4 rounded-xl overflow-y-auto h-full shadow-md">
        <div className="block sm:flex">
          <h2 className="text-xl font-bold mb-4">
            Post list: {totalPosts} {totalPosts == 1 ? `post` : `posts`}
          </h2>
          <div className="ml-auto mb-2 space-x-2">
            <label className="font-bold text-gray-600">Category</label>
            <select
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border rounded"
              required
            >
              <option value="news">News</option>
              <option value="promotion">Promotion</option>
              <option value="announcement">Announcement</option>
              <option value="about">About</option>
            </select>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {posts.map((post) => (
              <div
                key={post.post_id}
                className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
              >
                <div className="flex-1 space-y- overflow-hidden">
                  <h3 className="text-lg font-bold line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Category:
                    <span className="font-medium"> {post.category}</span>
                  </p>
                  {post.files && post.files.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm">Attached file:</h4>
                      <ul className="list-disc pl-5 text-sm ">
                        {post.files.map((file) => (
                          <li key={file.file_id}>
                            <a
                              href={`http://localhost:3000/public/${file.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {file.file_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => openModal(post)}
                    class="flex items-center gap-2 duration-300 bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No post.</p>
        )}
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
          >
            &lt;
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-4 w-3/4 lg:w-1/2 shadow-lg border overflow-auto h-5/6">
            <h2 className="text-xl font-bold mb-2">Edit post</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="block w-full  p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-gray-600">Content:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded"
                  rows="5"
                ></textarea>
              </div>
              <div>
                <label className="text-gray-600">Current file:</label>
                {selectedPost.files?.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    {selectedPost.files.map((file) => (
                      <li key={file.file_id} className="flex items-center">
                        <a
                          href={`http://localhost:3000/public/${file.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline w-full "
                        >
                          {file.file_name}
                        </a>

                        <div className="w-full flex">
                          <button
                            onClick={() => handleFileDelete(file.file_id)}
                            className="text-red-500 hover:underline text-xs ml-auto flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No attachments.</p>
                )}
              </div>
              {/* Thêm file mới */}
              <div>
                <label className="text-gray-600 ">Add attachments:</label>
                <FileUpload onChange={handleNewFileChange} />
                {selectedPost.newFiles?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">New file:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {selectedPost.newFiles.map((file, index) => (
                        <li key={index} className="flex justify-between">
                          {file.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveNewFile(index)}
                            className="text-red-500 hover:underline text-xs ml-auto flex"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-6 space-y-3 lg:space-y-0 lg:gap-2">
              {/* Remove Button */}
              <button
                onClick={() => deletePost(selectedPost.post_id)}
                className="block lg:flex items-center justify-center w-full lg:w-auto space-x-2 px-4 py-2 bg-rose-100 text-rose-900 rounded hover:bg-rose-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 m-auto"
                >
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
                <span>Remove post</span>
              </button>

              {/* Cancel Button */}
              <button
                onClick={closeModal}
                className="w-full ml-auto lg:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              {/* Update Button */}
              <button
                onClick={handleUpdatePost}
                className="w-full lg:w-auto px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangThongTin;
