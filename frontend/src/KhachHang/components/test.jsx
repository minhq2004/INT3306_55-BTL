import { useState } from "react";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Calendar, User, PlaneTakeoff, PlaneLanding } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("oneway");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();

  const [adultsCount, setAdultsCount] = useState(1);
  const [minorsCount, setMinorsCount] = useState(0);

  const PassengerSelector = () => {
    const updatePassengers = (newAdults, newMinors) => {
      setAdultsCount(newAdults);
      setMinorsCount(newMinors);
      setPassengers(`${newAdults} Adult - ${newMinors} Minor`);
    };

    return (
      <Card className="p-4 w-64 bg-white/80 backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Adults</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="bordered"
                onClick={() =>
                  updatePassengers(Math.max(1, adultsCount - 1), minorsCount)
                }
              >
                -
              </Button>
              <span>{adultsCount}</span>
              <Button
                size="sm"
                variant="bordered"
                onClick={() => updatePassengers(adultsCount + 1, minorsCount)}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Minors</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="bordered"
                onClick={() =>
                  updatePassengers(adultsCount, Math.max(0, minorsCount - 1))
                }
              >
                -
              </Button>
              <span>{minorsCount}</span>
              <Button
                size="sm"
                variant="bordered"
                onClick={() => updatePassengers(adultsCount, minorsCount + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const handleSearch = () => {
    // Validate inputs
    if (!departure || !destination || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    const totalPassengers = adultsCount + minorsCount;

    if (tripType === "oneway") {
      // Navigate to one-way flight search results
      navigate(
        `/flights/oneway/${departure}/${destination}/${departureDate}/${totalPassengers}`
      );
    } else {
      // Validate return date for round trip
      if (!returnDate) {
        alert("Please select a return date");
        return;
      }

      // Navigate to round-trip flight search results
      navigate(
        `/flights/roundtrip/${departure}/${destination}/${departureDate}/${returnDate}/${totalPassengers}`
      );
    }
  };

  return (
    <div className="relative w-full min-h-[500px] bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Decorative background circles */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trip Type Tabs */}
        <Tabs
          aria-label="Trip Type"
          selectedKey={tripType}
          onSelectionChange={(key) => setTripType(key)}
          className="mb-4 justify-center"
        >
          <Tab key="oneway" title="One Way" />
          <Tab key="roundtrip" title="Round Trip" />
        </Tabs>

        <div className="flex flex-col md:flex-row gap-0 bg-white/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          {/* From Input */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200/30">
            <Input
              placeholder="From Where?"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              startContent={
                <PlaneTakeoff className="text-gray-400" size={20} />
              }
              classNames={{
                base: "h-full",
                mainWrapper: "h-full",
                input: "text-medium bg-transparent",
                inputWrapper:
                  "h-full bg-transparent hover:bg-white/40 transition-colors",
              }}
            />
          </div>

          {/* To Input */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200/30">
            <Input
              placeholder="Where To?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              startContent={
                <PlaneLanding className="text-gray-400" size={20} />
              }
              classNames={{
                base: "h-full",
                mainWrapper: "h-full",
                input: "text-medium bg-transparent",
                inputWrapper:
                  "h-full bg-transparent hover:bg-white/40 transition-colors",
              }}
            />
          </div>

          {/* Departure Date Input */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200/30">
            <Input
              placeholder="Departure Date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              startContent={<Calendar className="text-gray-400" size={20} />}
              type="date"
              classNames={{
                base: "h-full",
                mainWrapper: "h-full",
                input: "text-medium bg-transparent",
                inputWrapper:
                  "h-full bg-transparent hover:bg-white/40 transition-colors",
              }}
            />
          </div>

          {/* Return Date Input (Only for Round Trip) */}
          {tripType === "roundtrip" && (
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200/30">
              <Input
                placeholder="Return Date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                startContent={<Calendar className="text-gray-400" size={20} />}
                type="date"
                classNames={{
                  base: "h-full",
                  mainWrapper: "h-full",
                  input: "text-medium bg-transparent",
                  inputWrapper:
                    "h-full bg-transparent hover:bg-white/40 transition-colors",
                }}
              />
            </div>
          )}

          {/* Passenger Selector */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200/30">
            <Popover placement="bottom">
              <PopoverTrigger>
                <Input
                  placeholder="Passengers"
                  value={passengers}
                  readOnly
                  startContent={<User className="text-gray-400" size={20} />}
                  classNames={{
                    base: "h-full cursor-pointer",
                    mainWrapper: "h-full",
                    input: "text-medium bg-transparent cursor-pointer",
                    inputWrapper:
                      "h-full bg-transparent hover:bg-white/40 transition-colors",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PassengerSelector />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <Button
            className="h-14 px-12 bg-[#6366f1] text-white rounded-none hover:bg-[#4f46e5] transition-colors"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
