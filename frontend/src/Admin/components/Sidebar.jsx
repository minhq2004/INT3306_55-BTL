import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const admin = localStorage.getItem("admin");

const Sidebar = () => {
  // State để quản lý item đang được chọn trong sidebar, lấy từ localStorage nếu có
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("activeItem") || "thongtin";
  });

  // State để quản lý style của thanh highlight khi chọn menu item
  const [rectStyle, setRectStyle] = useState({});

  // Ref để lưu trữ các tham chiếu đến các menu item
  const itemRefs = useRef({});

  // State để quản lý việc hiển thị/ẩn text trong sidebar
  const [isTextVisible, setIsTextVisible] = useState(true);

  // Xử lý khi click vào menu item - cập nhật active item và lưu vào localStorage
  const handleItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item);
  };

  // Toggle hiển thị/ẩn text trong sidebar
  const toggleTextVisibility = () => {
    setIsTextVisible(!isTextVisible);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out of your session?"
    );

    if (confirmLogout) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      toast.success("Logout successfully!");
    }
  };

  // Effect hook để cập nhật style của thanh highlight khi active item thay đổi
  useEffect(() => {
    if (itemRefs.current[activeItem]) {
      const { offsetTop, offsetHeight } = itemRefs.current[activeItem];
      setRectStyle({
        top: offsetTop,
        height: offsetHeight,
      });
    } else {
      setRectStyle({});
    }
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        setIsTextVisible(true);
      } else {
        setIsTextVisible(false);
      }
    };

    handleMediaQueryChange(mediaQuery);

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [activeItem]);

  return (
    <div className="flex h-[670px] min-h-screen w-fit z-0">
      <div
        className={`${
          isTextVisible ? "w-60" : "w-20"
        } bg-neutral-100 p-6 flex flex-col rounded-[30px] justify-between m-7 shadow-2xl relative transition-all duration-[30ms]`}
      >
        <button
          onClick={toggleTextVisibility}
          className="p-[5px] bg-sky-500 text-white rounded-full absolute top-1/2 right-[-14px] transform -translate-y-1/2 shadow-md"
        >
          {isTextVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </button>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            {isTextVisible ? (
              <img
                className="inline max-w-28 m-3 align-middle ml-12 transition-all"
                src="/logo.png"
                alt="QAirline logo"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="fill-sky-500"
              >
                <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM11 13V19H13V13H11Z"></path>
              </svg>
            )}
          </div>
          <ul className="space-y-8 relative">
            <div className="reg" style={rectStyle}></div>
            <Link
              to="/admin/thongtin"
              key="1"
              ref={(el) => (itemRefs.current["thongtin"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "thongtin" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("thongtin")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-sky-500 ${
                  activeItem === "thongtin" ? "fill-white" : "stroke-none"
                }`}
              >
                <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path>
              </svg>

              {isTextVisible && <span>Post</span>}
            </Link>
            <Link
              to="/admin/chuyenbay"
              key="2"
              ref={(el) => (itemRefs.current["chuyenbay"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "chuyenbay" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("chuyenbay")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class={`size-6 ml-1 stroke-sky-500 ${
                  activeItem === "chuyenbay" ? "fill-white" : "stroke-none"
                }`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              {isTextVisible && <span>Flight</span>}
            </Link>
            <Link
              to="/admin/datve"
              key="3"
              ref={(el) => (itemRefs.current["datve"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "datve" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("datve")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-sky-500 ${
                  activeItem === "datve" ? "fill-white" : "stroke-none"
                }`}
              >
                <path d="M21.0049 2.99979C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V9.49979C20.6242 9.49979 19.5049 10.6191 19.5049 11.9998C19.5049 13.3805 20.6242 14.4998 22.0049 14.4998V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V14.4998C3.38559 14.4998 4.50488 13.3805 4.50488 11.9998C4.50488 10.6191 3.38559 9.49979 2.00488 9.49979V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979H21.0049ZM20.0049 4.99979H4.00488V7.96779L4.16077 8.04886C5.49935 8.78084 6.42516 10.1733 6.49998 11.788L6.50488 11.9998C6.50488 13.704 5.55755 15.1869 4.16077 15.9507L4.00488 16.0308V18.9998H20.0049V16.0308L19.849 15.9507C18.5104 15.2187 17.5846 13.8263 17.5098 12.2116L17.5049 11.9998C17.5049 10.2956 18.4522 8.81266 19.849 8.04886L20.0049 7.96779V4.99979Z"></path>
              </svg>

              {isTextVisible && <span>Booking</span>}
            </Link>
            <Link
              to="/admin/taubay"
              key="4"
              ref={(el) => (itemRefs.current["taubay"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "taubay" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("taubay")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-none stroke-[1.5px] ${
                  activeItem === "taubay" ? "stroke-white" : "stroke-sky-500"
                }`}
              >
                <path d="M14 8.94737L22 14V16L14 13.4737V18.8333L17 20.5V22L12.5 21L8 22V20.5L11 18.8333V13.4737L3 16V14L11 8.94737V3.5C11 2.67157 11.6716 2 12.5 2C13.3284 2 14 2.67157 14 3.5V8.94737Z"></path>
              </svg>
              {isTextVisible && <span>Airplane</span>}
            </Link>
            <Link
              to="/admin/taikhoan"
              key="5"
              ref={(el) => (itemRefs.current["taikhoan"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "taikhoan" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("taikhoan")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-sky-500 ${
                  activeItem === "taikhoan" ? "fill-white" : "stroke-none"
                }`}
              >
                <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 16C10.1243 16 8.29182 16.8687 7.01276 18.2556C8.38039 19.3474 10.114 20 12 20C13.9695 20 15.7727 19.2883 17.1666 18.1081C15.8956 16.8074 14.1219 16 12.1597 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.8106 4.6015 15.4807 5.61557 16.8214C7.25639 15.0841 9.58144 14 12.1597 14C14.6441 14 16.8933 15.0066 18.5218 16.6342C19.4526 15.3267 20 13.7273 20 12C20 7.58172 16.4183 4 12 4ZM12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5ZM12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7Z"></path>
              </svg>
              {isTextVisible && <span>Account</span>}
            </Link>
            <Link
              to="/admin/dichvu"
              key="6"
              ref={(el) => (itemRefs.current["dichvu"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "dichvu" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("dichvu")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-sky-500 ${
                  activeItem === "dichvu" ? "fill-white" : "stroke-none"
                }`}
              >
                <path d="M5.50045 20C6.32888 20 7.00045 20.6715 7.00045 21.5C7.00045 22.3284 6.32888 23 5.50045 23C4.67203 23 4.00045 22.3284 4.00045 21.5C4.00045 20.6715 4.67203 20 5.50045 20ZM18.5005 20C19.3289 20 20.0005 20.6715 20.0005 21.5C20.0005 22.3284 19.3289 23 18.5005 23C17.672 23 17.0005 22.3284 17.0005 21.5C17.0005 20.6715 17.672 20 18.5005 20ZM2.17203 1.75732L5.99981 5.58532V16.9993L20.0005 17V19H5.00045C4.44817 19 4.00045 18.5522 4.00045 18L3.99981 6.41332L0.757812 3.17154L2.17203 1.75732ZM16.0005 2.99996C16.5527 2.99996 17.0005 3.44768 17.0005 3.99996L16.9998 5.99932L19.9936 5.99996C20.5497 5.99996 21.0005 6.45563 21.0005 6.99536V15.0046C21.0005 15.5543 20.5505 16 19.9936 16H8.0073C7.45123 16 7.00045 15.5443 7.00045 15.0046V6.99536C7.00045 6.44562 7.4504 5.99996 8.0073 5.99996L10.9998 5.99932L11.0005 3.99996C11.0005 3.44768 11.4482 2.99996 12.0005 2.99996H16.0005ZM9.99981 7.99932L9.00045 7.99996V14L9.99981 13.9993V7.99932ZM15.9998 7.99932H11.9998V13.9993H15.9998V7.99932ZM19.0005 7.99996L17.9998 7.99932V13.9993L19.0005 14V7.99996ZM15.0005 4.99996H13.0005V5.99996H15.0005V4.99996Z"></path>
              </svg>

              {isTextVisible && <span>Service</span>}
            </Link>
            <Link
              to="/admin/khuyenmai"
              key="7"
              ref={(el) => (itemRefs.current["khuyenmai"] = el)}
              className={`flex items-center space-x-3 cursor-pointer relative z-10 ${
                activeItem === "khuyenmai" ? "text-white" : "text-gray-600"
              }`}
              onClick={() => handleItemClick("khuyenmai")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-6 ml-1 fill-sky-500 ${
                  activeItem === "khuyenmai" ? "fill-white" : "stroke-none"
                }`}
              >
                <path d="M10.0544 2.0941C11.1756 1.13856 12.8248 1.13855 13.9461 2.09411L15.2941 3.24286C15.4542 3.37935 15.6533 3.46182 15.8631 3.47856L17.6286 3.61945C19.0971 3.73663 20.2633 4.9028 20.3805 6.37131L20.5214 8.13679C20.5381 8.34654 20.6205 8.54568 20.757 8.70585L21.9058 10.0539C22.8614 11.1751 22.8614 12.8243 21.9058 13.9456L20.757 15.2935C20.6206 15.4537 20.538 15.6529 20.5213 15.8627L20.3805 17.6281C20.2633 19.0967 19.0971 20.2628 17.6286 20.3799L15.8631 20.5208C15.6533 20.5376 15.4542 20.6201 15.2941 20.7566L13.9461 21.9053C12.8248 22.8609 11.1756 22.8608 10.0543 21.9053L8.70631 20.7566C8.54615 20.6201 8.34705 20.5376 8.1373 20.5209L6.37184 20.3799C4.9033 20.2627 3.73716 19.0966 3.61997 17.6281L3.47906 15.8627C3.46232 15.6529 3.37983 15.4538 3.24336 15.2936L2.0946 13.9455C1.13905 12.8243 1.13904 11.1752 2.09458 10.0539L3.24334 8.70589C3.37983 8.54573 3.46234 8.34654 3.47907 8.13678L3.61996 6.3713C3.73714 4.90278 4.90327 3.73665 6.3718 3.61946L8.13729 3.47857C8.34705 3.46183 8.54619 3.37935 8.70636 3.24286L10.0544 2.0941ZM12.6488 3.61632C12.2751 3.29782 11.7253 3.29781 11.3516 3.61632L10.0036 4.76509C9.5231 5.17456 8.92568 5.42201 8.29637 5.47223L6.5309 5.61312C6.04139 5.65219 5.65268 6.04089 5.61362 6.53041L5.47272 8.29593C5.4225 8.92521 5.17505 9.52259 4.76559 10.0031L3.61683 11.3511C3.29832 11.7248 3.29831 12.2746 3.61683 12.6483L4.76559 13.9963C5.17506 14.4768 5.4225 15.0743 5.47275 15.7035L5.61363 17.469C5.65268 17.9585 6.04139 18.3473 6.53092 18.3863L8.29636 18.5272C8.92563 18.5774 9.5231 18.8249 10.0036 19.2344L11.3516 20.3831C11.7254 20.7016 12.2751 20.7016 12.6488 20.3831L13.9969 19.2343C14.4773 18.8249 15.0747 18.5774 15.704 18.5272L17.4695 18.3863C17.959 18.3472 18.3478 17.9585 18.3868 17.469L18.5277 15.7035C18.5779 15.0742 18.8253 14.4768 19.2349 13.9964L20.3836 12.6483C20.7022 12.2746 20.7021 11.7249 20.3836 11.3511L19.2348 10.0031C18.8253 9.52259 18.5779 8.92519 18.5277 8.2959L18.3868 6.53041C18.3478 6.0409 17.959 5.65219 17.4695 5.61312L15.704 5.47224C15.0748 5.42203 14.4773 5.17455 13.9968 4.76508L12.6488 3.61632ZM14.8284 7.75718L16.2426 9.1714L9.17154 16.2425L7.75733 14.8282L14.8284 7.75718ZM10.2322 10.232C9.64641 10.8178 8.69667 10.8178 8.11088 10.232C7.52509 9.6463 7.52509 8.69652 8.11088 8.11073C8.69667 7.52494 9.64641 7.52494 10.2322 8.11073C10.818 8.69652 10.818 9.6463 10.2322 10.232ZM13.7677 15.8889C14.3535 16.4747 15.3032 16.4747 15.889 15.8889C16.4748 15.3031 16.4748 14.3534 15.889 13.7676C15.3032 13.1818 14.3535 13.1818 13.7677 13.7676C13.1819 14.3534 13.1819 15.3031 13.7677 15.8889Z"></path>
              </svg>
              {isTextVisible && <span>Promotion</span>}
            </Link>
          </ul>
        </div>
        <div>
          <div className="text-gray-600 mb-2 ml-2">
            {isTextVisible && (
              <p className="text-sm">Admin: {JSON.parse(admin)?.name}</p>
            )}
          </div>
          <Link
            to="/"
            onClick={(e) => {
              if (!handleLogout()) {
                e.preventDefault(); // Cancel navigation
              }
            }}
            class="flex items-center space-x-3 cursor-pointe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 stroke-sky-500 ml-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            {isTextVisible && (
              <p className="text-gray-600 text-sm font-medium duration-700">
                Logout
              </p>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
