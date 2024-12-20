import { Card, Button } from "@nextui-org/react";

const PassengerSelector = ({
  adultsCount,
  minorsCount,
  onUpdatePassengers,
}) => {
  const updatePassengers = (newAdults, newMinors) => {
    onUpdatePassengers(newAdults, newMinors);
  };

  return (
    <Card className="p-6 w-72 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-blue-800 font-medium">Adults</span>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 min-w-[32px] h-8"
              variant="bordered"
              onClick={() =>
                updatePassengers(Math.max(1, adultsCount - 1), minorsCount)
              }
            >
              -
            </Button>
            <span className="w-8 text-center font-semibold text-blue-800">
              {adultsCount}
            </span>
            <Button
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 min-w-[32px] h-8"
              variant="bordered"
              onClick={() => updatePassengers(adultsCount + 1, minorsCount)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-800 font-medium">Minors</span>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 min-w-[32px] h-8"
              variant="bordered"
              onClick={() =>
                updatePassengers(adultsCount, Math.max(0, minorsCount - 1))
              }
            >
              -
            </Button>
            <span className="w-8 text-center font-semibold text-blue-800">
              {minorsCount}
            </span>
            <Button
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 min-w-[32px] h-8"
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

export default PassengerSelector;