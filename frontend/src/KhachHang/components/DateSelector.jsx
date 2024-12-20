import { useRef } from "react";

import { Calendar } from "lucide-react";

const DateInput = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null); // Tạo một ref để tham chiếu đến input

  return (
    <div className="relative w-full h-full">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <Calendar className="text-gray-400" size={20} /> {/* Biểu tượng lịch */}
      </span>
      <input
        ref={inputRef} // Gán ref cho input
        type="date" // Kiểu input là date
        value={value} // Giá trị của input
        onChange={(e) => onChange(e.target.value)} // Gọi hàm onChange khi giá trị thay đổi
        placeholder={placeholder} // Placeholder cho input
        className="h-full w-full bg-transparent text-medium pl-12 pr-4 outline-none cursor-pointer hover:bg-white/40 transition-colors" // Các lớp CSS cho input
      />
    </div>
  );
};

export default DateInput;
