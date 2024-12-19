import { useRef, useState } from "react";
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DateInput = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectingYear, setIsSelectingYear] = useState(false);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (dateStr) => {
    onChange(dateStr);
  };

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + offset))
    );
  };

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => currentYear + i);
  };

  const renderYearSelector = () => (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2">
        {generateYearRange().map((year) => (
          <button
            key={year}
            onClick={() => {
              setCurrentDate(new Date(year, currentDate.getMonth()));
              setIsSelectingYear(false);
            }}
            className="p-2 rounded-lg text-sm hover:bg-blue-50 transition-colors
              hover:text-blue-600 active:bg-blue-100"
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return (
      <div className="p-4 select-none">
        {/* Header with month/year selection */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors
                text-blue-600 font-medium"
            >
              {months[currentDate.getMonth()]}
            </button>
            <button
              onClick={() => setIsSelectingYear(true)}
              className="px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors
                text-blue-600 font-medium"
            >
              {currentDate.getFullYear()}
            </button>
          </div>

          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center p-1 text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Empty cells */}
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} className="p-1" />
            ))}

          {/* Date cells */}
          {Array(daysInMonth)
            .fill(null)
            .map((_, index) => {
              const day = index + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = value === dateStr;
              const isToday =
                new Date().toISOString().split("T")[0] === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => handleDateChange(dateStr)}
                  className={`
                    relative p-1 text-sm rounded-lg transition-all duration-200
                    hover:bg-blue-50 hover:text-blue-600
                    ${
                      isSelected
                        ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                        : "text-gray-700"
                    }
                    ${isToday ? "ring-2 ring-blue-200" : ""}
                  `}
                >
                  <span className="relative z-10">{day}</span>
                  {isToday && (
                    <span className="absolute inset-0 rounded-lg ring-2 ring-blue-200" />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="w-full h-full">
        <div className="h-full relative group">
          <Input
            ref={inputRef}
            value={formatDisplayDate(value)}
            readOnly
            placeholder={placeholder}
            startContent={
              <Calendar
                className="text-gray-400 group-hover:text-blue-500 transition-colors"
                size={20}
              />
            }
            classNames={{
              base: "h-full",
              mainWrapper: "h-full",
              input: "text-medium bg-transparent cursor-pointer h-full",
              inputWrapper:
                "h-full bg-transparent hover:bg-white/40 transition-colors cursor-pointer rounded-none",
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-[320px] bg-white shadow-xl rounded-xl overflow-hidden">
          {isSelectingYear ? renderYearSelector() : renderCalendar()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateInput;
