import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Newspaper,
  TagsIcon,
  Bell,
  Store,
  ChevronRight,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRightIcon,
  FileText,
  File,
  Download,
} from "lucide-react";
import { Button, Pagination } from "@nextui-org/react";
import { Helmet } from "react-helmet";

const fadeInUp = `animate-in fade-in-0 slide-in-from-bottom-4 duration-700`;
const scaleIn = `animate-in zoom-in-95 duration-500`;
const DEFAULT_IMAGE = "/qairline.jpg";

// File type checker utility
const getFileType = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
};

const ImageSlider = ({ images = [], blogDetail = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // If no images provided, use default image
  const displayImages =
    images.length > 0 ? images : [{ file_path: DEFAULT_IMAGE }];

  const nextSlide = (e) => {
    if (e) e.preventDefault();
    e?.stopPropagation();
    setLoading(true);
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e) => {
    if (e) e.preventDefault();
    e?.stopPropagation();
    setLoading(true);
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const getImageUrl = (filePath) => {
    if (!filePath) return DEFAULT_IMAGE;
    return filePath.startsWith("/")
      ? filePath
      : `http://localhost:3000/public/${filePath}`;
  };

  return (
    <div
      className={`relative flex justify-center bg-gray-100 ${
        loading ? "min-h-[200px]" : ""
      }`}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Current Image */}
      <img
        key={currentIndex}
        src={getImageUrl(displayImages[currentIndex]?.file_path)}
        alt={`Slide ${currentIndex + 1}`}
        className={`w-full ${
          blogDetail ? "max-w-none h-auto" : "h-[400px] object-cover"
        }
          ${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        onLoad={handleImageLoad}
      />

      {/* Navigation Controls */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5
              shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110
              active:scale-95 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5
              shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110
              active:scale-95 z-10"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
          </button>

          {/* Image Counter */}
          <div
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1
            text-white text-sm z-10"
          >
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLoading(true);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FileList = ({ files = [] }) => {
  const downloadableFiles = files.filter(
    (file) =>
      getFileType(file.file_path) === "pdf" ||
      getFileType(file.file_path) === "other"
  );

  if (downloadableFiles.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {downloadableFiles.map((file, index) => {
        const fileType = getFileType(file.file_path);
        return (
          <a
            key={index}
            href={`http://localhost:3000/public/${file.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm
              transition-all hover:shadow-md"
          >
            {fileType === "pdf" ? (
              <FileText className="h-6 w-6 text-red-500" />
            ) : (
              <File className="h-6 w-6 text-gray-500" />
            )}
            <span className="flex-1 text-gray-700">
              {file.file_path.split("/").pop()}
            </span>
            <Download className="h-5 w-5 text-gray-400" />
          </a>
        );
      })}
    </div>
  );
};

const CategoryCard = ({ category, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 mb-6
      ${fadeInUp}
      ${
        isSelected
          ? "bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl scale-[0.98]"
          : "bg-white hover:shadow-lg hover:scale-[0.97] active:scale-95"
      }
    `}
  >
    <div className="p-8">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-[1.25rem] p-4 transition-colors duration-300
          ${isSelected ? "bg-white/20" : "bg-blue-50 group-hover:bg-blue-100"}`}
        >
          <category.icon
            className={`h-7 w-7 transition-colors duration-300
            ${isSelected ? "text-white" : "text-blue-600"}`}
          />
        </div>
        <span
          className={`font-medium text-lg transition-colors duration-300
          ${
            isSelected
              ? "text-white"
              : "text-gray-700 group-hover:text-blue-600"
          }`}
        >
          {category.label}
        </span>
      </div>
    </div>
  </button>
);

// PostCard - Enhanced rounded corners and margin
const PostCard = ({ post, navigate }) => {
  const images =
    post.files?.filter((file) => getFileType(file.file_path) === "image") || [];
  const displayImage =
    images.length > 0
      ? `http://localhost:3000/public/${images[0].file_path}`
      : DEFAULT_IMAGE;

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-white shadow-lg
        transition-all duration-500 hover:shadow-xl mb-10 ${fadeInUp}`}
    >
      {/* Image Section */}
      <div className="relative h-[30rem] overflow-hidden rounded-[2rem]">
        <img
          src={displayImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700
            group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90 rounded-[2rem]" />

        {/* Category Badge */}
        <div
          className="absolute left-8 top-8 transform -rotate-1 translate-y-4 opacity-0
          group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
        >
          <div
            className="rounded-full bg-white/95 backdrop-blur-md px-6 py-2.5
            text-sm font-medium text-blue-600 shadow-xl"
          >
            {post.category}
          </div>
        </div>

        {/* Date Badge */}
        <div
          className="absolute right-8 top-8 transform translate-y-4 opacity-0
          group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
        >
          <div
            className="flex items-center gap-2.5 rounded-full bg-black/30 backdrop-blur-md
            px-6 py-2.5 text-sm text-white/90"
          >
            <Clock className="h-4 w-4" />
            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="absolute inset-x-0 bottom-0 p-10 transform translate-y-4
          group-hover:translate-y-0 transition-transform duration-500"
        >
          <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-white/90 line-clamp-2 mb-8">{post.content}</p>

          <button
            onClick={() => navigate(`/blog/${post.post_id}`)}
            className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md
              px-8 py-3 font-medium text-white border border-white/20
              hover:bg-white hover:text-blue-600 transition-all duration-300"
          >
            Đọc tiếp
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("news");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { id: "news", label: "Tin tức", icon: Newspaper },
    { id: "promotion", label: "Khuyến mãi", icon: TagsIcon },
    { id: "announcement", label: "Thông báo", icon: Bell },
    { id: "about", label: "Về chúng tôi", icon: Store },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/public/posts/${selectedCategory}/page/${page}`
      );
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(Number(data.currentPage));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    navigate(`/blog?category=${categoryId}`, { replace: true });
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-white p-8 shadow-lg animate-pulse"
              >
                <div className="h-80 rounded-2xl bg-gray-200 mb-6" />
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded-lg bg-gray-200" />
                  <div className="h-4 w-1/4 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </title>
      </Helmet>
      <div className="rounded-lg mb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 mt-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12 bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg">
            <h1
              className={`text-4xl font-bold bg-clip-text text-transparent
            bg-gradient-to-r from-blue-600 to-blue-800 mb-4 ${fadeInUp}`}
            >
              Khám phá QAirlines
            </h1>
            <p
              className={`text-gray-600 text-lg max-w-2xl mx-auto ${fadeInUp}`}
            >
              Cập nhật những tin tức mới nhất về dịch vụ, khuyến mãi và hoạt
              động của chúng tôi
            </p>
          </div>

          {/* Categories Section */}
          <div className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
              />
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {posts.map((post) => (
              <PostCard key={post.post_id} post={post} navigate={navigate} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex justify-center ${fadeInUp}`}>
              <Pagination
                total={totalPages}
                initialPage={currentPage}
                onChange={handlePageChange}
                showControls
                size="lg"
                classNames={{
                  wrapper:
                    "gap-2 bg-white/50 backdrop-blur-md rounded-full p-2 shadow-lg",
                  item: "w-10 h-10 text-sm rounded-full hover:bg-blue-50",
                  cursor:
                    "bg-blue-600 text-white font-medium rounded-full shadow-lg shadow-blue-100",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setIsLoading(true);
      try {
        const { data: postData } = await axios.get(
          `http://localhost:3000/api/public/posts/${postId}`
        );
        setPost(postData);

        // Fetch all posts from the same category
        const { data: relatedData } = await axios.get(
          `http://localhost:3000/api/public/posts/${postData.category}/page/1`
        );

        // Filter out the current post and get up to 3 random related posts
        const filteredPosts = relatedData.posts.filter(
          (p) => p.post_id !== postId
        );
        const shuffledPosts = [...filteredPosts].sort(
          () => Math.random() - 0.5
        );
        setRelatedPosts(shuffledPosts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 mt-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-pulse space-y-8">
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/4 bg-gray-200 rounded-lg" />
            <div className="aspect-video bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-4 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Get image files
  const images =
    post.files?.filter((file) => getFileType(file.file_path) === "image") || [];
  const displayImages =
    images.length > 0 ? images : [{ file_path: DEFAULT_IMAGE }];

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
      </Helmet>
      <div className="rounded-lg mb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 mt-20">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <Button
              className={`mb-8 group ${fadeInUp}`}
              variant="light"
              onClick={() => navigate("/blog")}
            >
              <ArrowLeft
                className="w-4 h-4 mr-2 transition-transform duration-300
              group-hover:-translate-x-1"
              />
              Quay lại tin tức
            </Button>

            <article
              className={`bg-white rounded-3xl shadow-xl ${scaleIn} mb-8 overflow-hidden`}
            >
              {/* Hero Section with Image and Overlay */}
              <div className="relative h-[400px] w-full mb-8">
                <ImageSlider images={displayImages} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm
                    font-medium text-blue-600 shadow-lg"
                    >
                      {post.category}
                    </span>
                    <span
                      className="flex items-center gap-2 text-sm text-white/90 bg-black/30
                    backdrop-blur-sm rounded-full px-4 py-1.5"
                    >
                      <Clock className="h-4 w-4" />
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {post.title}
                  </h1>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-8 pb-8">
                {/* File Downloads */}
                {post.files && <FileList files={post.files} />}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="border-t border-gray-200 pt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Bài viết cùng chủ đề
                    </h2>
                    <Button
                      className="group"
                      variant="light"
                      onClick={() =>
                        navigate(`/blog?category=${post.category}`)
                      }
                    >
                      Xem tất cả
                      <ChevronRight
                        className="w-4 h-4 ml-2 transition-transform duration-300
                      group-hover:translate-x-1"
                      />
                    </Button>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {relatedPosts.map((relatedPost) => (
                      <PostCard
                        key={relatedPost.post_id}
                        post={relatedPost}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export { BlogList, BlogDetail };
