import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const LocationInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeCountry, setActiveCountry] = useState(null);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const inputRef = useRef(null);

  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/public/locations"
      );
      const data = response.data;
      setSuggestions(data);
      if (data.length > 0) {
        setActiveCountry(data[0]);
      }
    } catch (error) {
      console.error("Error fetching all locations:", error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/locations/${query}`
      );
      const data = response.data;
      setSuggestions(data);
      if (data.length > 0) {
        setActiveCountry(data[0]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim()) {
      fetchSuggestions(inputValue);
    } else {
      fetchAllLocations();
    }
    setDropdownVisible(true);
  };

  const handleSelectSuggestion = (city) => {
    onChange(city);
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    if (!value.trim()) fetchAllLocations();
    setDropdownVisible(true);
  };

  const handleMouseEnterCountry = (country) => {
    setActiveCountry(country);
  };

  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        minWidth: rect.width,
        maxWidth: "600px",
      };
    }
    return {};
  };

  useEffect(() => {
    if (isDropdownVisible) {
      const position = calculateDropdownPosition();
      setDropdownStyles({
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: `${position.minWidth}px`,
        maxWidth: position.maxWidth,
        zIndex: 50,
      });
    }
  }, [isDropdownVisible]);

  return (
    <div className="relative w-full h-full">
      <div className="h-full relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      {isDropdownVisible &&
        suggestions.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={dropdownStyles}
            className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl max-h-[400px] overflow-hidden animate-in fade-in duration-200"
          >
            <div className="flex divide-x divide-gray-100">
              {/* Country List */}
              <div className="w-1/3 bg-gray-50/80 backdrop-blur-md">
                <div className="sticky top-0 bg-gray-50/90 backdrop-blur-md px-3 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600">
                    Countries
                  </h3>
                </div>
                <div className="max-h-[360px] overflow-auto">
                  {suggestions.map((group) => (
                    <div
                      key={group.country}
                      onMouseEnter={() => handleMouseEnterCountry(group)}
                      className={`
                        mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer
                        transition-all duration-200 ease-in-out
                        ${
                          activeCountry?.country === group.country
                            ? "bg-sky-500 text-white shadow-md"
                            : "hover:bg-sky-100 text-gray-700 hover:text-gray-900"
                        }
                      `}
                    >
                      <div className="font-medium">{group.country}</div>
                      <div className="text-xs opacity-80">
                        {group.cities.length} cities
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cities List */}
              <div className="w-2/3 bg-white">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600">
                    Cities in {activeCountry?.country}
                  </h3>
                </div>
                <div className="max-h-[360px] overflow-auto p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {activeCountry?.cities.map((city) => (
                      <div
                        key={city}
                        onClick={() => handleSelectSuggestion(city)}
                        className="
                          px-3 py-2 rounded-lg cursor-pointer
                          transition-all duration-200 ease-in-out
                          hover:bg-blue-50 text-gray-700 hover:text-gray-900
                          hover:shadow-sm
                        "
                      >
                        <div className="font-medium">{city}</div>
                        <div className="text-xs text-gray-500">
                          {activeCountry.country}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LocationInput;
