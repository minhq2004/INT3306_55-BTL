import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowLeft,
  Calendar,
  Clock,
  Newspaper,
  Gift,
  Megaphone,
  Info,
} from "lucide-react";

import { Button, Link } from "@nextui-org/react";
import { Helmet } from "react-helmet";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const selectedCategory = searchParams.get("category") || "news";

  const categories = [
    {
      id: "news",
      label: "Tin tức",
      color: "bg-sky-500",
      lightColor: "bg-sky-50",
      icon: Newspaper,
      description: "Cập nhật tin tức mới nhất về ngành hàng không",
    },
    {
      id: "promotion",
      label: "Khuyến mãi",
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      icon: Gift,
      description: "Các ưu đãi và khuyến mãi hấp dẫn",
    },
    {
      id: "announcement",
      label: "Thông báo",
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      icon: Megaphone,
      description: "Các thông báo quan trọng từ Q Airlines",
    },
    {
      id: "about",
      label: "Về chúng tôi",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      icon: Info,
      description: "Tìm hiểu thêm về Q Airlines",
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, currentPage]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const endpoint = `http://localhost:3000/api/public/posts/${selectedCategory}/page/${currentPage}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPostImage = (post) => {
    if (post.files && post.files.length > 0) {
      const imageFile = post.files.find((file) =>
        file.file_type.startsWith("image/")
      );
      if (imageFile) {
        return `http://localhost:3000/public/${imageFile.file_path}`;
      }
    }
    // Return the default image URL if no image files are found
    return "/qairline.jpg";
  };

  const currentCategory =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const CategoryIcon = currentCategory.icon;

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </title>
      </Helmet>
      <div className="min-h-screen mb-20">
        <div className="max-w-6xl mx-auto px-4 py-8 bg-white rounded-3xl shadow-xl">
          {/* Header section remains the same */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-indigo-400/10 rounded-2xl blur-2xl" />
            <div className="relative text-center py-10 px-6 rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center mb-6">
                <div
                  className={`w-16 h-16 rounded-xl ${currentCategory.color} bg-opacity-15 flex items-center justify-center transform hover:scale-105 transition-transform duration-300`}
                >
                  <CategoryIcon
                    className={`w-8 h-8 ${currentCategory.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-800 to-indigo-700 bg-clip-text text-transparent mb-4">
                {currentCategory.label}
              </h1>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Category Tabs section remains the same */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSearchParams({ category: category.id });
                  setCurrentPage(1);
                }}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
                    ${
                      selectedCategory === category.id
                        ? `${category.color} text-white shadow-sm`
                        : `${category.lightColor} text-gray-700`
                    }
                    transform hover:scale-102 hover:-translate-y-0.5 active:scale-98`}
              >
                <category.icon
                  className={`w-5 h-5 ${
                    selectedCategory === category.id
                      ? "text-white"
                      : `${category.color.replace("bg-", "text-")}`
                  }`}
                />
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Posts Grid with updated image handling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.post_id}
                onClick={() => navigate(`/blog/${post.post_id}`)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getPostImage(post)}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/qairline.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium 
                        ${
                          categories.find((c) => c.id === post.category)
                            ?.color || categories[0].color
                        } 
                        text-white`}
                    >
                      {categories.find((c) => c.id === post.category)?.label ||
                        "Tin tức"}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{Math.floor(Math.random() * 10)} phút đọc</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination section remains the same */}
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-all duration-300 font-medium text-sm
                    ${
                      currentPage === page
                        ? `${currentCategory.color} text-white shadow-sm`
                        : `${currentCategory.lightColor} text-gray-700 hover:bg-gray-50`
                    }
                    transform hover:scale-105 hover:-translate-y-0.5 active:scale-95`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/public/posts/${postId}`
      );
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const imageFiles =
    post.files?.filter((file) => file.file_type.startsWith("image/")) || [];
  const downloadFiles =
    post.files?.filter((file) => !file.file_type.startsWith("image/")) || [];

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 mb-20 rounded-md">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="group mb-12 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại</span>
          </button>

          <article className="bg-white rounded-3xl shadow-xl overflow-hidden ">
            <div className="relative h-96">
              <img
                src={
                  imageFiles.length > 0
                    ? `http://localhost:3000/public/${imageFiles[currentSlide].file_path}`
                    : "/qairline.jpg"
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {imageFiles.length > 1 && (
                <>
                  <button
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? imageFiles.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === imageFiles.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {imageFiles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all
                          ${
                            currentSlide === index
                              ? "bg-white scale-110"
                              : "bg-white/50 hover:bg-white"
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-12">
              <div className="flex items-center gap-6 mb-8">
                <span className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-medium">
                  {post.category}
                </span>
                <time className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                <div className="space-y-6">
                  {post.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {downloadFiles.length > 0 && (
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Tài liệu đính kèm
                  </h3>
                  <div className="space-y-4">
                    {downloadFiles.map((file) => (
                      <div
                        key={file.file_id}
                        className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <Download className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {file.file_path.split("/").pop()}
                          </h4>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            as={Link}
                            href={`http://localhost:3000/public/${file.file_path}`}
                            download
                            target="_blank"
                            color="primary"
                          >
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export { BlogList, BlogDetail };
