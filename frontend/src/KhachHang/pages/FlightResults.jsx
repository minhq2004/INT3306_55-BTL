import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { PlaneTakeoff, PlaneLanding } from "lucide-react";

// Component các thẻ thông tin chuyến bay
const FlightCard = ({ flight, isRoundTrip = false }) => {
  return (
    <Card key={flight.flight_id} className="mb-4">
      <Card Header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PlaneTakeoff />
          <span>{flight.departure}</span>
          <PlaneLanding />
          <span>{flight.destination}</span>
        </div>
        <div>
          <span>{new Date(flight.departure_time).toLocaleString()}</span>
        </div>
      </Card>
      <CardBody>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4>Economy</h4>
            <p>Price: ${flight.economy_price}</p>
            <p>Available: {flight.economy_available} seats</p>
          </div>
          <div>
            <h4>Business</h4>
            <p>Price: ${flight.business_price}</p>
            <p>Available: {flight.business_available} seats</p>
          </div>
          <div>
            <h4>First Class</h4>
            <p>Price: ${flight.first_class_price}</p>
            <p>Available: {flight.first_class_available} seats</p>
          </div>
        </div>
        <Button className="mt-4 w-full" color="primary">
          {isRoundTrip ? "Select Outbound Flight" : "Select Flight"}
        </Button>
      </CardBody>
    </Card>
  );
};

// Component chính hiển thị kết quả tìm kiếm chuyến bay
const FlightResults = () => {
  // State quản lý dữ liệu chuyến bay
  const [flightData, setFlightData] = useState({
    outboundFlights: [], // Chuyến bay đi
    inboundFlights: [], // Chuyến bay về
  });

  // State loading và error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy tham số từ url
  const { departure, destination, departure_time, return_time, amount } =
    useParams();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        let response;

        // Xác đinh 1 chiều hay khứ hồi
        if (return_time) {
          // Tìm kiếm khứ hồi
          response = await axios.get(
            `http://localhost:3000/api/public/flights/roundtrip/${departure}/${destination}/${departure_time}/${return_time}/${amount}`
          );
          setFlightData({
            outboundFlights: response.data.outboundFlights || [],
            inboundFlights: response.data.inboundFlights || [],
          });
        } else {
          // Tìm kiếm một chiều
          response = await axios.get(
            `http://localhost:3000/api/public/flights/oneway/${departure}/${destination}/${departure_time}/${amount}`
          );
          setFlightData({
            outboundFlights: Array.isArray(response.data) ? response.data : [],
            inboundFlights: [],
          });
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [departure, destination, departure_time, return_time, amount]);

  if (isLoading) return <div>Loading flights...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {return_time ? "Round Trip" : "One Way"} Flights
      </h1>

      {return_time ? (
        <>
          <h2 className="text-xl mb-4">Outbound Flights</h2>
          {flightData.outboundFlights.map((flight) => (
            <FlightCard
              key={flight.flight_id}
              flight={flight}
              isRoundTrip={true}
            />
          ))}

          <h2 className="text-xl my-4">Return Flights</h2>
          {flightData.inboundFlights.map((flight) => (
            <FlightCard key={flight.flight_id} flight={flight} />
          ))}
        </>
      ) : (
        flightData.outboundFlights.map((flight) => (
          <FlightCard key={flight.flight_id} flight={flight} />
        ))
      )}
    </div>
  );
};

export default FlightResults;
