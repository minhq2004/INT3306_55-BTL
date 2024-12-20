import { useRef } from "react";

import { Calendar } from "lucide-react";

const DateInput = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  return (
    <div className="relative w-full h-full">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <Calendar className="text-gray-400" size={20} />
      </span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-medium pl-12 pr-4 outline-none cursor-pointer hover:bg-white/40 transition-colors"
      />
    </div>
  );
};

export default DateInput;
