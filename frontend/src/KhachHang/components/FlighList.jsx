import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Pagination,
  Card,
  CardBody,
} from "@nextui-org/react";
import { Plane } from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/public/flights/page/${currentPage}`
      );
      setFlights(data.data);
      setTotalPages(data.total_pages);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching flights"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [currentPage]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "primary";
      case "delayed":
        return "warning";
      case "cancelled":
        return "danger";
      case "boarding":
        return "success";
      case "inprogress":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Spinner label="Đang tải dữ liệu..." color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <p className="text-danger">{error}</p>
        <button
          onClick={fetchFlights}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const MobileFlightCard = ({ flight }) => (
    <Card className="mb-4">
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {flight.flight_number}
            </p>
            <p className="text-sm text-gray-600">{`${flight.manufacturer} ${flight.model}`}</p>
          </div>
          <Chip color={getStatusColor(flight.status)} variant="flat" size="sm">
            {flight.status}
          </Chip>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {flight.departure}
              </p>
              <p className="text-xs text-gray-500">
                {formatDateTime(
                  flight.departure_date + "T" + flight.departure_time
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {flight.destination}
              </p>
              <p className="text-xs text-gray-500">
                {formatDateTime(
                  flight.arrival_date + "T" + flight.arrival_time
                )}
              </p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm font-medium text-gray-800 mb-2">Giá vé:</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Phổ thông</p>
                <p className="font-medium text-gray-800">
                  {formatPrice(flight.economy_price)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Thương gia</p>
                <p className="font-medium text-gray-800">
                  {formatPrice(flight.business_price)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Hạng nhất</p>
                <p className="font-medium text-gray-800">
                  {formatPrice(flight.first_class_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>All flights</title>
      </Helmet>
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4">
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                Danh sách chuyến bay
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Tất cả các chuyến bay hiện có
              </p>
            </div>
          </div>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {flights.map((flight) => (
              <MobileFlightCard key={flight.flight_id} flight={flight} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <Table
              aria-label="Flight list table"
              classNames={{
                wrapper: "rounded-lg",
                th: "bg-gray-50 text-gray-800",
                td: "text-gray-600",
              }}
            >
              <TableHeader>
                <TableColumn>Số hiệu</TableColumn>
                <TableColumn>Điểm đi</TableColumn>
                <TableColumn>Điểm đến</TableColumn>
                <TableColumn>Khởi hành</TableColumn>
                <TableColumn>Hạ cánh</TableColumn>
                <TableColumn>Máy bay</TableColumn>
                <TableColumn>Hạng phổ thông</TableColumn>
                <TableColumn>Hạng thương gia</TableColumn>
                <TableColumn>Hạng nhất</TableColumn>
                <TableColumn align="center">Trạng thái</TableColumn>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.flight_id}>
                    <TableCell>{flight.flight_number}</TableCell>
                    <TableCell>{flight.departure}</TableCell>
                    <TableCell>{flight.destination}</TableCell>
                    <TableCell>
                      {formatDateTime(
                        flight.departure_date + "T" + flight.departure_time
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(
                        flight.arrival_date + "T" + flight.arrival_time
                      )}
                    </TableCell>
                    <TableCell>{`${flight.manufacturer} ${flight.model}`}</TableCell>
                    <TableCell>{formatPrice(flight.economy_price)}</TableCell>
                    <TableCell>{formatPrice(flight.business_price)}</TableCell>
                    <TableCell>
                      {formatPrice(flight.first_class_price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Chip
                          color={getStatusColor(flight.status)}
                          variant="flat"
                          size="sm"
                        >
                          {flight.status}
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            classNames={{
              wrapper: "gap-2",
              item: "text-gray-600",
              cursor: "bg-primary text-white",
            }}
            showControls
          />
        </div>
      </div>
    </>
  );
};

export default FlightList;
