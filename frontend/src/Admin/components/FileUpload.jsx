import React, { useRef, useState } from "react";

const FileUpload = ({ onChange }) => {
  const fileInputRef = useRef();
  const [files, setFiles] = useState([]); // Lưu danh sách file trong state
  const [dragActive, setDragActive] = useState(false);

  // Hàm xử lý file khi chọn hoặc kéo thả
  const handleFiles = (filesList) => {
    const selectedFiles = Array.from(filesList);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // Truyền danh sách file ra ngoài nếu có onChange
    if (onChange) {
      onChange({
        target: {
          files: selectedFiles, // Truyền theo cấu trúc tương tự sự kiện DOM
        },
      });
    }
  };

  // Khi chọn file từ input
  const handleInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files); // Gọi hàm xử lý khi chọn file
    }
  };

  // Khi kéo thả file
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files); // Gọi hàm xử lý khi kéo thả file
    }
    setDragActive(false); // Tắt trạng thái kéo thả
  };

  // Các sự kiện liên quan đến drag
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleClick = () => fileInputRef.current.click();

  return (
    <div>
      <div
        className={`border border-dashed rounded-md p-4 text-center mt-2 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleInputChange} // Lắng nghe sự kiện chọn file
          className="hidden"
        />
        <div className="cursor-pointer text-gray-600 hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 mx-auto mb-2"
          >
            <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9V15H10V9H5L12 2L19 9H14Z"></path>
          </svg>

          <p className="text-sm">Click to select file or drag & drop</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
