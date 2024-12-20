import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { DoorClosed } from "lucide-react";
import Seat from "./Seat";
import { Helmet } from "react-helmet";
const SeatMap = ({
  seats,
  loading,
  error,
  selectedSeats = [],
  onSeatSelect,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg font-medium">{error}</p>
        <Button
          variant="light"
          color="primary"
          className="mt-4"
          onPress={onRetry}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <>
        <Helmet>
          <title>Choose your seat</title>
        </Helmet>
        <div className="text-center h-[400px] flex items-center justify-center">
          <p className="text-lg text-gray-600">
            Không có ghế trống trong hạng này
          </p>
        </div>
      </>
    );
  }

  // Sắp xếp ghế theo seat_number
  const seatRows = seats.reduce((rows, seat) => {
    const rowNum = seat.seat_number.match(/\d+/)[0];
    if (!rows[rowNum]) rows[rowNum] = [];
    rows[rowNum].push(seat);
    return rows;
  }, {});

  return (
    <>
      <Helmet>
        <title>Choose your seat</title>
      </Helmet>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Container cố định chiều cao */}
        <div className="h-[450px] relative">
          {/* Airplane Icon - Fixed at top */}
          <div className="sticky top-0 bg-white z-10 pb-4">
            <div className="flex justify-center">
              <div className="w-20 h-19 rounded-t-full flex items-center justify-center">
                <DoorClosed className="text-gray-400" size={32} />
              </div>
            </div>
          </div>

          {/* Scrollable Seat Grid */}
          <div className="overflow-y-auto h-[calc(100%-84px)] mt-2 pt-3">
            <div className="flex flex-col items-center space-y-2 min-h-min">
              {Object.entries(seatRows).map(([rowNum, rowSeats]) => (
                <div key={rowNum} className="flex space-x-6">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some(
                      (s) => s.seat_id === seat.seat_id
                    );
                    return (
                      <Tooltip
                        key={seat.seat_id}
                        content={`${
                          seat.seat_number
                        } - ${seat.seat_price?.toLocaleString()} VND`}
                      >
                        <div>
                          <Seat
                            seatNumber={seat.seat_number}
                            selected={isSelected}
                            onClick={() => onSeatSelect(seat)}
                            status={seat.status}
                          />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatMap;
